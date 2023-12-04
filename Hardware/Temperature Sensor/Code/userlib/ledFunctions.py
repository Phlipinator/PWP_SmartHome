# import Pins from machine in order to address the GPIO Pins.
from machine import Pin, Timer # type: ignore
import time
import math

# Setup all LED pins

ledG = Pin(27, Pin.OUT) # Single green LED on Pin 27 w/ 100 Ohm resistor - visualizing State 3: Full Online Access
ledB = Pin(26, Pin.OUT) # Single blue LED on Pin 26 w/ 100 Ohm resistor - visualizing State 2: Local Network
ledY = Pin(25, Pin.OUT) # Single yellow LED on Pin 25 w/ 100 Ohm resistor - visualizing State 1: Access Point / Captive Portal
ledR = Pin(33, Pin.OUT) # Single red LED on Pin 33 w/ 100 Ohm resistor - visualizing State 0: Offline (Manual Interaction)

# Array to map the LEDs to state
leds = [ledR, ledY, ledB, ledG]

# Timer utilized for blinking LEDs
ledTimer = Timer(2)

# Current LED status
ledState = 0

# Turn all four LEDs on
def allOn():
    ledB.on()
    ledG.on()
    ledY.on()
    ledR.on()

# Turn all four LEDs off
def allOff():
    ledB.off()
    ledG.off()
    ledY.off()
    ledR.off()

# Rotates one step through all the LEDs from low to high (used mainly for boot animation)
def rotate():
    global ledState
    leds[ledState].off()
    ledState = (ledState + 1) % 4
    leds[ledState].on()

#
def setLedState(state):
    # Try to match the state to the corresponding LED
    try:
        allOff()
        leds[state].on()
        global ledState
        ledState = state
    except Exception as e:
        print(f'Could not set LED state to {state} due to error: {e}')

# Toggles the specified (default = current ledState) LED on and off. Utilized for blinking it as a status indicator.
def toggleLED(ledID=None):
    if ledID is None:
        ledID = ledState
    leds[ledID].value(leds[ledID].value() ^ 1) # Toggle value with bitwise XOR https://stackoverflow.com/a/1871430

# Callback for LEDtimer
def ledTimerCB(timer):
    # Toggle currently active LED
    toggleLED(ledState)
    # And turn all others off.
    for led in leds:
        if led != leds[ledState]:
            led.off()

# Set current ledState LED into a pending state, blinking it continuously. Or deactivate it again with active = False.
def pendingState(active=True):
    global ledTimer
    if(active):
        ledTimer.init(period=200, mode=Timer.PERIODIC, callback=ledTimerCB)
    else:
        ledTimer.deinit()
        #leds[ledState].on()
        ledTimer.init(mode=Timer.ONE_SHOT, period=1000, callback=delayedTurnOn)

def delayedTurnOn(timer):
    leds[ledState].on()