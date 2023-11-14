# Implementation with EPSNOW instead of MQTT
import os
# ESP network functionality
import network # type: ignore
# For handling everything MQTT.
import userlib.ledViz as ledViz

# EXECUTIONS ------------- 
print('Enabling WLAN...')
sta = network.WLAN(network.STA_IF)  # Or network.AP_IF
sta.active(True)

ledViz.initialize()