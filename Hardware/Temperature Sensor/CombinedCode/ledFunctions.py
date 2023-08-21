# import Pins from machine in order to address the GPIO Pins.
from machine import Pin
import time
import math

# Setup all LED pins
ledB = Pin(27, Pin.OUT)  # Single Blue LED on Pin 3 w/ 100 Ohm Resistor
ledG = Pin(26, Pin.OUT)  # Single Green LED on Pin 1 w/ 100 Ohm Resistor
ledY = Pin(25, Pin.OUT)  # Single Yellow LED on Pin 22 w/ 100 Ohm Resistor
ledR = Pin(33, Pin.OUT)  # Single Red LED on Pin 23 w/ 100 Ohm Resistor

# Array to map the LEDs to state
leds = [ledB, ledG, ledY, ledR]

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

# blinks the LED led for n times waiting wait ms between each step.
def blink(led, n, wait):
  i = 0
  while(i < n):
    led.on()
    time.sleep_ms(wait)
    led.off()
    time.sleep_ms(wait)
    i += 1

# blinks ledY and ledG alternately for n times waiting wait ms between each step.
def blinkBoth(n, wait):
  i = 0
  while(i < n):
    ledG.on()
    ledY.off()
    time.sleep_ms(wait)
    ledY.on()
    ledG.off()
    time.sleep_ms(wait)
    i += 1
  ledY.off()
  ledG.off()