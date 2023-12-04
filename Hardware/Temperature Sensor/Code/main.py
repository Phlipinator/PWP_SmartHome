# Python time functionality
import time
# For interacting with the ESP board.
import machine # type: ignore # (Tells Pylance to ignore this problem.)
# ESP network functionality
import network # type: ignore
# For interacting with all the LEDs connected to the ESP.
import userlib.ledFunctions as leds
# For displaying two digit numbers on the matrix display.
import userlib.doubleDigits as display
# For the motorized slider.
from userlib.motorSlider import MotorSlider
# For handling the BME280 sensor.
import userlib.BME280 as BME280
# For handling everything MQTT.
import userlib.mqttClient as mqtt
# Our environment variables
import env
# For handling everything ledVisualization of datastreams.
import userlib.lofiLedViz as ledViz
# Interface to access point code (for state 1 and network credentials)
from ap.access_point import AccessPoint

# The current State gets stored here and updated with the Slider AND the MQTT topic
currentState = -1
# When an update is detected the Target State is stored here, in order to resolve it to currentState ASAP.
targetState = -1
# The percentage the slider started a change request at.
# Required to check if the slider moved enough since then to deinit the changeTimer.
# (I.e. the user is still moving the slider - we only want to start a state change when he is done moving the slider!)
lastPCT = -1.0
# Locks state updates via slider as long as an externally requested update is in progress
externalUpdate = False

# Assign timers we utilize in this code.
loopTimer = machine.Timer(0)
changeTimer = machine.Timer(1)

#############
# Functions #
#############

# Returns the current readings from the BME280 sensor (optionally without units due to them being assigned in Home Assistant).
# You should wrap this in try except.
def getSensorReadings(units):
    # BME280 readings according to https://randomnerdtutorials.com/micropython-bme280-esp32-esp8266/
    global bme
    temperature = bme.temperature
    humidity = bme.humidity
    pressure = bme.pressure

    # print(f'Current sensor readings are: temperature: {temperature}, humidity: {humidity}, pressure: {pressure}')

    # Optionally remove units before returning (as they may be assigned in Home Assistant already for example)
    if(not units):
        temperature = temperature.replace('C','')
        humidity = humidity.replace('%','')
        pressure = pressure.replace('hPa','')

    return (temperature, humidity, pressure)

# Tries fetching the current slider state and if it changed updates LEDs accordingly and publishes it.
def updateSliderState():
    try:
        newState = ms.readState()
        checkStateUpdate(newState, False)

    except Exception as e:
        print(f'Could not read slider or update state and LEDs due to error: {e}')

# Checks whether a state update is required and initializes it if it is.
def checkStateUpdate(newState, external):
    global targetState, externalUpdate

    if newState != targetState:
        externalUpdate = external
        targetState = newState
        leds.setLedState(targetState)
        if targetState != currentState:
            # Target state is a different state, therefore we signal a pending change and start the countdown for change initialization.
            leds.pendingState(True)
            # Because we only want to initialize a state change when the slider didn't move for a certain time, we start a countdown here.
            # We also save the position of the slider in order to check if we moved.
            global lastPCT
            lastPCT = round(ms.readPCT(),2)
            changeTimer.init(mode=machine.Timer.ONE_SHOT, period=2000, callback=changeCallback)
        else:
            # In this case the slider was moved back to its original state before a state change was initialized.
            leds.pendingState(False)
        #mqtt.publishState(str(currentState))
    else:
        # Deinit the changeTimer if the slider moved (with some leeway for measuring variability)
        diffPCT = abs(ms.readPCT() - lastPCT)
        if diffPCT > 0.03:
            changeTimer.deinit()
            # If the target is still different from current State, reinit the Timer
            if targetState != currentState:
                global lastPCT
                lastPCT = round(ms.readPCT(),2)
                changeTimer.init(mode=machine.Timer.ONE_SHOT, period=2000, callback=changeCallback)


# Called if the changeTimer manages to run out (i.e. the slider was not moved during this time)
def changeCallback(timer):
    changeState(targetState)

# Signals that the state was successfully updated.
def stateUpdated():
    leds.pendingState(False)
    global targetState, currentState, externalUpdate
    currentState = targetState
    externalUpdate = False
    leds.leds[leds.ledState].on() # Sometimes this update gets swallowed within pendingState(False), so we do it again to make sure the led is on.
    

# Activate State 0 (offline)
def stateOffline():
    if(not env.DEBUG_MODE):
        ms.moveToPCT(0)
    print("Activated State 0: Offline")
    ledViz.visualizeTempState(0) # Datastream Visualization for MUM Showcase with ESPNow
    stateUpdated()

# Activate State 1 (Access Point)
def stateAccessPoint():
    if(not env.DEBUG_MODE):
        ms.moveToPCT(0.333)
    ap.start()
    print("Activated State 1: Access Point")
    ledViz.visualizeTempState(1) # Datastream Visualization for MUM Showcase with ESPNow
    stateUpdated()

# Activate State 2 (Local Network)
def stateLocalNetwork():
    if(not env.DEBUG_MODE):
        ms.moveToPCT(0.666)
    if (not station.isconnected()):
        enableWLAN()
    if (not mqtt.isConnected):
        startMQTT()
    mqtt.publishState(2)
    print("Activated State 2: Local Network")
    ledViz.visualizeTempState(2) # Datastream Visualization for MUM Showcase with ESPNow
    stateUpdated()

# Activate State 3 (Online)
def stateOnline():
    if(not env.DEBUG_MODE):
        ms.moveToPCT(1)
    if (not station.isconnected()):
        enableWLAN()
    if (not mqtt.isConnected):
        startMQTT()
    mqtt.publishState(3)
    print("Activated State 3: Online")
    ledViz.visualizeTempState(3) # Datastream Visualization for MUM Showcase with ESPNow
    stateUpdated()

# Deactivate a specified state (shutdown any additional functionality associated with this state)
def changeState(newStateId):
    global currentState
    currentState = int(currentState) # Just to make sure currentState is an int for the comparisons.
    print(f'Changing from state {currentState} to {newStateId}.')
    if newStateId == 0:
        if currentState == 1:
            ap.stop()
            print('Access point deactivated.')
        elif currentState == 2 or currentState == 3:
            mqtt.publishState(0)
            mqtt.disconnect()
            disableWLAN()
        stateOffline()

    elif newStateId == 1:
        if currentState == 2 or currentState == 3:
            mqtt.publishState(1)
            mqtt.disconnect()
            disableWLAN()
        stateAccessPoint()
    
    elif newStateId == 2:
        if currentState == 1:
            ap.stop()
            print('Access point deactivated.')
        stateLocalNetwork()

    
    elif newStateId == 3:
        if currentState == 1:
            ap.stop()
            print('Access point deactivated.')
        stateOnline()
    
    else:
        print(f'There is no state {newStateId}. Either you are trolling or something went wrong.')


# Callback function for incoming MQTT messages. Provides handling for these messages.
def subscription_cb(topic, msg):
    msg = msg.decode('utf-8')
    print('Inc. message: [%s] %s' % (topic, msg))
    # Handle incoming state here
    if topic == env.STATE_TOPIC_IN:
        try:
            print('Received new state from HA: ' + msg)
            global currentState
            newState = int(msg)
            checkStateUpdate(newState, True)
        except:
            print('Couldn\'t handle state \'%s\'. Ignoring it instead: ' % msg)

# Enable WLAN connectivity and connect to the router specified within the wifi.creds file accessible (read/write) via the ap interface.
# If the connection fails (router unreachable, wrong creds) after a certain time / amounts of attempts return to previous state.
def enableWLAN():
    # Network credentials are handled via the access point interface.
    ssid, password = ap.getCredentials()

    station.active(True)
    station.connect(ssid, password)

    # TODO Abort after x failed attempts / x time
    while station.isconnected() == False:
        # LEDs rotating: status = booting and connecting
        # leds.rotate() # This was the old indicator for when it was still in the process of connecting. Now we have a separate 'pending' indicator for state changes that is more concise.
        time.sleep_ms(50)

    print('WLAN connection successful')
    print(station.ifconfig())
    # End network connection procedure (if we get here we can assume we're connected).

# Disconnect from the current WLAN connection and disable WLAN connectivity.
def disableWLAN():
    station.disconnect()
    station.active(False)
    print('WLAN connection terminated')

# Initialize our MQTT connection
def startMQTT():
    try:
        mqtt.connect() # Connect to broker
        print('MQTT connection successful!')

        # Subscribe to the inc. State Topic
        mqtt.subscribeTopic(env.STATE_TOPIC_IN)

    except OSError as e:
        print('Failed MQTT connection with error: %s' % e)
        # TODO Maybe less heavyhanded errorhandling
        mqtt.restart_and_reconnect() # Try again later on fail.


# Callback function that gets infinitely called in a loop by a timer initialized at start.
def loopCallback(timer):
    try:
        (temp, hum, pres) = getSensorReadings(units=False)
    except Exception as e:
        print(f'Could not get sensor readings due to error: {e}')

    # Try displaying current sensor readings.
    try:
        display.displayNumbers(round(float(temp)))
    except Exception as e:
        print(f'Could not display sensor readings due to error: {e}')
    
    if(currentState == 1):
        # Try publishing current sensor readings.
        try:
            ap.setSensorData(temp, hum, pres)
        except Exception as e:
            print(f'Could not publish sensor readings to Access Point due to error: {e}')
    
    if(currentState == 2 or currentState ==3):
        # Try publishing current sensor readings.
        try:
            mqtt.publishData(temp, hum, pres)
        except Exception as e:
            print(f'Could not publish sensor readings to MQTT due to error: {e}')
        
        mqtt.tryRead()
    
    if(not externalUpdate):
        updateSliderState()

    # Debugging:
    # print(f'Current state is: {currentState}, ledState is: {leds.ledState}, slider is at: {ms.readPCT()}')
    

def stopLoop():
    loopTimer.deinit()


#####################
# Execute on start: #
#####################

# BME280 sensor: assignment of I2C parameters
i2c = machine.I2C(scl=machine.Pin(19), sda=machine.Pin(18), freq=10000)
# Initialize BME sensor
bme = BME280.BME280(i2c=i2c)

# Initialization of motorSlider
ms = MotorSlider(34,32,16,17)

# Create an access point instance for future interaction with access point functionality.
ap = AccessPoint()

# Initialize the WLAN access station and MQTT client for later use in state 2 and 3.
station = network.WLAN(network.STA_IF)
station.active(True) # Must stay active for ESPNow (therefore it is already activated here).

# Initialization of datastream visualization via ESPNow
# ledViz.initialize()

mqtt.initClient(subscription_cb)

# Update state once upon initialization to match the current slider position.
updateSliderState()

# Initialize timer that calls ongoing functionality infinitely
loopTimer.init(period=500, mode=machine.Timer.PERIODIC, callback=loopCallback)