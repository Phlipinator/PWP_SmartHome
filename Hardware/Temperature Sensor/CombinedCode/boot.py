# Import os in order to interact with files on the esp.
import os

# Other imports:
import network

# Turn off vendor OS debugging messages, in order to see only own debugging.
import esp
esp.osdebug(None)

# Run the garbage collector to reclaim memory occupied by objects that are no longer in use by the program.
# This is useful to save space in the flash memory
import gc
gc.collect()

# My custom ledFunctions to interact with all the LEDs on my board.
import ledFunctions as leds

import time

# I'm using the LEDs as status indicators, so I can see what the ESP is doing even without Serial connection.
# leds.allOn() # Deactivated in favour of the rotation below.

# Network credentials. (Change to yours.) TODO TO BE REMOVED LATER
ssid = ''
password = ''

station = network.WLAN(network.STA_IF)

station.active(True)
station.connect(ssid, password)

while station.isconnected() == False:
  # LEDs rotating: status = booting and connecting
  leds.rotate()
  time.sleep_ms(100)


print('Connection successful')
print(station.ifconfig())
# End network connection procedure (if we get here we can assume we're connected).

# LEDs off again: status = boot complete.
leds.allOff()