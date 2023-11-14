# Implementation with EPSNOW instead of MQTT
# Python time functionality
import time
import os
# For interacting with all the LEDs connected to the ESP.
import userlib.ledFunctions as leds
# For handling network functionality
import network # type: ignore
# For handling everything MQTT.
import userlib.espnowClient as espnow
# Multithreading Capabilities
import _thread

# DEFINITIONS ----------
# Callback function for incoming MQTT messages. Provides handling for these messages.
def handleMSG(msg):
    # Handle incoming state here #TODO: Integrate Topic Check?
    try:
        msg = msg.decode('utf-8')
        print('Received new data viz instructions: ' + msg)
        streamID = int(msg[0:2])
        onOff = int(msg[2])
        leds.changeViz(streamID, onOff)
    except:
        print('Couldn\'t handle data viz instructions: ' + msg)

def startListen():
    _thread.start_new_thread(getMessages, ())

def getMessages():
    while True:
        host, msg = espnow.getMessage()
        if msg:             # msg == None if timeout in recv()
            print('Msg from [%s]: %s' % (host, msg))
            handleMSG(msg)
            if msg == b'end':
                break

def stopAll():
    leds.stopLoop()
    leds.clearAll()

# The LED stripe connections, that are connected to this ESP
# There are two IDs per connection between each of the devices, one per "direction" of data.
# The IDs are always two digit numbers, one digit per connected device.
# The first digit is the device where the data stream should start, one is where it should arrive.
# The IDs of the devices are as according to our presentation setup, from leftmost to rightmost then up to down.
# This means: 1 = Screen (outside) | 2 = Screen (inside) | 3 = Router | 4 = Cam | 5 = Thermometer | 6 = IoT Hub (Home Assistant)
# E.g. 34 refers to the stream of data from Router to Cam.
# For our setup this also means, that if a ESP serves connection 34, it also servers connection 43.
LEFT_DATASTREAM_IDS = [13,31,23,32,36,63] # Left DataViz ESP
RIGHT_DATASTREAM_IDS = [24,42,25,52,46,64,56,65] # Right DataViz ESP

# EXECUTIONS -------------
print('Enabling WLAN...')
sta = network.WLAN(network.STA_IF)  # Or network.AP_IF
sta.active(True)

# Initialize LED strips
import userlib.ledFunctions as leds
mac = sta.config('mac')
if (mac == espnow.leftLedController):
    print('I am the left ledController, thus I handle these connections: '+str(LEFT_DATASTREAM_IDS))
    leds.setupNeopixels(LEFT_DATASTREAM_IDS)
elif (mac == espnow.rightLedController):
    print('I am the right ledController, thus I handle these connections: '+str(RIGHT_DATASTREAM_IDS))
    leds.setupNeopixels(RIGHT_DATASTREAM_IDS)
else:
    print('My MAC-Adress doesn\'t match either the left or right controller. Maybe you need to update them in the code?')
    print('This is my MAC-Adress: ' + sta.config('mac'))

# Indicate successful boot
leds.allOn(0,0,255)
time.sleep_ms(1000)
leds.clearAll()

print('Initializing EPSNow client...')
espnow.initESPNow()

# Start LED animation loop
leds.startLoop()

# Function for debugging, that sets specific LED strips to active.
leds.activeAnimations = []

# Start espnow Thread (for reading ESPnow Messages)
startListen()