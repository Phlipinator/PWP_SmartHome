# Implementation with EPSNOW instead of MQTT
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
import userlib.espnowClient as espnow
# Our environment variables
import env

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

loopTimer = Timer(1)
def startLoop():
    # Initialize timer that calls ongoing functionality infinitely
    loopTimer.init(period=500, mode=Timer.PERIODIC, callback=loopCallback)

def loopCallback(timer):
    try:
        host, msg = espnow.getMessage()
        if msg:
            print('Inc. msg from [%s]: %s' % (host, msg))
            handleMSG(msg)

    except OSError as e:
        print(f'Error checking for ESPnow messages: {e}')
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

print('Initializing EPSNow client...')
espnow.initESPNow()

# Start LED animation loop
leds.startLoop()

# Function for debugging, that sets specific LED strips to active.
leds.activeAnimations = []

# Start espnow Thread (for reading ESPnow Messages)
espnow.startListen()