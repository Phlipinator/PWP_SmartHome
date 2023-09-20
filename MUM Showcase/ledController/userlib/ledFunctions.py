# import Pins from machine in order to address the GPIO Pins.
from machine import Pin, Timer # type: ignore
import time
import math

# Setup all the required Neopixel LED strips
# Docu here: https://docs.micropython.org/en/latest/esp8266/tutorial/neopixel.html
import neopixel # type: ignore # (Tells Pylance to ignore this problem.)

# Variables that affect the animation.
# Distance of the dots on the strips from each other
animDist = 5
# The color the animation will be based upon in regular cases. (And revert to if issues are fixed)
originalColor = (0,255,255)

# Initialize all Neopixel strips as empty. They get assigned during initialization as required.
np13 = None
np23 = None
np36 = None
np24 = None
np25 = None
np46 = None
np56 = None
ledStrips = []
# datasreamIDs this ESP handles
availableIDs = []

# Array that contains all led IDs with active animations. It is periodically checked by the animation loop and then acted upon accordingly.
activeAnimations = []
# Counter that indicates the current state of animations (which of the pixels should glow)
animationState = 0
# Colors of the animation
animColor = (255,255,255) # Main color
fadeColor = (127,127,127) # Color the side LEDs are using

# Initialize all Neopixels that should be connected
# Length of the strips: 13: 100cm -> 20px, 23: 55cm -> 11px, 36: 30cm -> 6px, 24: 30cm -> 6px, 25: 65cm -> 13px, 46: 65cm -> 13px, 56: 55cm -> 11px
def setupNeopixels(npIDs):
    global availableIDs
    availableIDs = npIDs

    for id in npIDs:
        global np13, np23, np36, np24, np25, np46, np56
        if id == 13:
            np13 = neopixel.NeoPixel(Pin(32),20)
            ledStrips.append(np13)
        elif id == 23:
            np23 = neopixel.NeoPixel(Pin(33),11)
            ledStrips.append(np23)
        elif id == 36:
            np36 = neopixel.NeoPixel(Pin(25),6)
            ledStrips.append(np36)
        elif id == 24:
            np24 = neopixel.NeoPixel(Pin(26),6)
            ledStrips.append(np24)
        elif id == 25:
            np25 = neopixel.NeoPixel(Pin(27),13)
            ledStrips.append(np25)
        elif id == 46:
            np46 = neopixel.NeoPixel(Pin(14),13)
            ledStrips.append(np46)
        elif id == 56:
            np56 = neopixel.NeoPixel(Pin(13),11)
            ledStrips.append(np56)



def allOn(r=255,g=255,b=255):
    for ls in ledStrips:
        n = ls.n
        for i in range(n):
            ls[i] = (r, g, b)
        ls.write()

def clearAll():
    allOn(0,0,0)

def clearAllNoWrite():
    for ls in ledStrips:
        n = ls.n
        for i in range(n):
            ls[i] = (0,0,0)

def writeAll():
    for ls in ledStrips:
        ls.write()

# Writes the necessary values for creating a flowing pulse animation to the neopixel object (but not yet to the strip!)
def createPulseAnimation(strip, startLED):
    # Activate the required LEDs and set adjacent LEDs
    stripLength = strip.n
    for i in range(0, stripLength, animDist):
        pos = startLED + i
        if 0 <= pos < stripLength:
            strip[pos] = animColor
            
            # Set adjacent LEDs if they are within bounds
            if pos - 1 >= 0:
                strip[pos - 1] = fadeColor
            if pos + 1 < stripLength:
                strip[pos + 1] = fadeColor

# Changes the animation color to the specified RGB value
def changeColor(color):
    global animColor, fadeColor
    animColor = color
    fadeColor = tuple(int(value/2) for value in color)

changeColor(originalColor)

# Changes a streamID in the active animations to on or off (if possible and not already on).
def changeViz(streamID, onOff):
    if (streamID in availableIDs):
        if (onOff == 1):
            if streamID not in activeAnimations:
                activeAnimations.append(streamID)
        else:
            try:
                activeAnimations.remove(streamID)
            except ValueError:
                pass

# Functions to handle timed animations below ------------
# Timer utilized for LED animations
loopTimer = Timer(0)

def startLoop():
    # Initialize timer that calls ongoing functionality infinitely
    loopTimer.init(period=100, mode=Timer.PERIODIC, callback=loopCallback)

def stopLoop():
    loopTimer.deinit()

def loopCallback(timer):
    # Set all LEDs to off
    clearAllNoWrite()

    # Activate all LEDs according to animations that should be active
    for anim in activeAnimations:
        strip = mapIDtoNP(anim)
        createPulseAnimation(strip, mapDirectionToState(anim))
    
    # Write the cleared and newly animated LEDs
    writeAll()

    # Increment the current animationState
    global animationState
    animationState = (animationState + 1) % animDist


# Utility functions -------------------------
# All of the datastreamIDs that flow towards the ESP
negativeIDs = [13,23,63,24,25,64,65]
# Maps the ID of a stream to a direction the animation should flow in
def mapDirectionToState(streamID):
    if streamID in negativeIDs:
        return animDist - animationState - 1
    else:
        return animationState

# Maps the ID of a LED strip to the actual object
def mapIDtoNP(id):
    if id == 13 or id == 31:
        return np13
    elif id == 23 or id == 32:
        return np23
    elif id == 36 or id == 63:
        return np36
    elif id == 24 or id == 42:
        return np24
    elif id == 25 or id == 52:
        return np25
    elif id == 46 or id == 64:
        return np46
    elif id == 56 or id == 65:
        return np56
    else:
        return None