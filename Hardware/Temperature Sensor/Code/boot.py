# Both of the following imports are not actually needed in the current script.
# Importing them here however allows for easier interaction with files and machine functions via serial or web REPL connections.
# In production you can therefore delete this.
import os
import machine # type: ignore # (Tells Pylance to ignore this problem.)

# Turn off vendor OS debugging messages, in order to see only own debugging.
import esp # type: ignore # (Tells Pylance to ignore this problem.)
esp.osdebug(None)

# Run the garbage collector to reclaim memory occupied by objects that are no longer in use by the program.
# This is useful to save space in the flash memory
import gc
gc.collect()

# My custom ledFunctions to interact with all the LEDs on my board.
import userlib.ledFunctions as leds

import time

# A faster way to reset the ESP via serial.
def reset():
    machine.reset()

# Rotate LEDs for 2 seconds as a boot animation (In order to indicate a working state and show when the device reboots).
leds.ledState = 3 # So the first rotation starts with led 0.
for i in range(20):
    # LEDs rotating: status = booting and connecting
    leds.rotate()
    time.sleep_ms(100)

print('Boot successful.')

# Turn all LEDs off again so they can pick up their intended indicator function afterwards.
leds.allOff()