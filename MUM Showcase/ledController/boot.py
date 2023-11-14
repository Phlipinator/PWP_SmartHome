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

# A faster way to reset the ESP via serial.
def reset():
    machine.reset()

print('Boot successful.')