# Python time functionality
import time
import os
# For interacting with the ESP board.
from machine import Timer # type: ignore # (Tells Pylance to ignore this problem.)
# For interacting with all the LEDs connected to the ESP.
import userlib.ledFunctions as leds
# For handling network functionality
import userlib.networkUtil as net
# For handling everything MQTT.
import userlib.mqttClient as mqtt
# Our environment variables
import env

# DEFINITIONS ----------

# Callback function for incoming MQTT messages. Provides handling for these messages.
def subscription_cb(topic, msg):
    msg = msg.decode('utf-8')
    print('Inc. message: [%s] %s' % (topic, msg))
    # Handle incoming state here
    if topic == env.DATAVIZ_TOPIC:
        try:
            print('Received new data viz instructions: ' + msg)
            streamID = int(msg[0:2])
            onOff = int(msg[2])
            leds.changeViz(streamID, onOff)
        except:
            print('Couldn\'t handle data viz instructions: ' + msg)

loopTimer = Timer(1)
def startLoop():
    # Initialize timer that calls ongoing functionality infinitely
    loopTimer.init(period=500, mode=Timer.PERIODIC, callback=loopCallback)

def loopCallback(timer):
    try:
        mqtt.read()
    except OSError as e:
        print(f'Error checking for MQTT messages: {e}')
        # leds.changeColor((255,0,0)) # TODO Comment in again

def stopLoop():
    loopTimer.deinit()

def stopAll():
    stopLoop()
    leds.stopLoop()
    leds.clearAll()

# EXECUTIONS ------------- 

# Indicate successful boot
leds.allOn(0,0,255)
time.sleep_ms(1000)
leds.clearAll()

print('Establishing WLAN network connection...')
net.enableWLAN()

print('Initializing MQTT client...')
mqtt.initClient(subscription_cb)

# Start LED animation loop
leds.startLoop()

# Start main loop (for reading MQTT)
startLoop()

# Function for debugging, that sets all existing LED strips to active. TODO: Deactivate
leds.activeAnimations = []