from machine import Pin, I2C
import time
import userlib.ledViz as ledViz
import network

#bit1 = 0
bit1Old = 0
#bit2 = 0
bit2Old = 0

pin1 = Pin(22, Pin.IN)
pin2 = Pin(21, Pin.IN)

station = network.WLAN(network.STA_IF)
station.active(True)

ledViz.initialize()

def hasChanged():
    global bit1Old
    global bit2Old
    if not pin1.value() == bit1Old or not pin2.value() == bit2Old:
        bit1Old = pin1.value()
        bit2Old = pin2.value()
        return True
    return False

def sendNewState():
    # convert pin values to a 2-bit number
    newState = 0
    if pin1.value():
        newState += 1
    if pin2.value():
        newState += 2
    print('Sending newState: ' + str(newState))
    # send the new state to the LED visualization
    ledViz.visualizeTempState(newState)

while True:
    if hasChanged():
        sendNewState()

