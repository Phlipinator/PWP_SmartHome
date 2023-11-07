# Implementation with EPSNOW instead of MQTT
import os
# For handling network functionality
import userlib.networkUtil as net
# For handling everything MQTT.
import userlib.espnowClient as espnow

# DEFINITIONS ----------
def sendMsg(target, msg):
    espnow.sendMessage(target,msg)

# EXECUTIONS ------------- 
print('Establishing WLAN network connection...')
net.enableWLAN()

print('Initializing EPSNow client...')
espnow.initESPNow()

l = espnow.leftLedController
r = espnow.rightLedController
espnow.addPeer(l)
espnow.addPeer(r)