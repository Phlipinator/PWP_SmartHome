import doubleDigits
import time
from bmp280 import *
from machine import Pin,I2C

bus = I2C(0,scl=Pin(21),sda=Pin(22),freq=200000)
bmp = BMP280(bus)
bmp.use_case(BMP280_CASE_INDOOR)

###CONNECTION####
# The connection of the matrix display cannot be changed
# VCC to 5.5V
# GND to Ground
# DIN to GPIO13
# CS  to GPIO15
# CLK to GPIO14
#
# The connections of the sensor can be changed abvove
# VCC to 3.3V
# GND to Ground
# SLC to GPIO21
# SDA to GPIO22
#################

while True:
    doubleDigits.displayNumbers(round(bmp.temperature))
    time.sleep(5)
