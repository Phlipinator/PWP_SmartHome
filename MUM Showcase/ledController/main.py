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
startListen()