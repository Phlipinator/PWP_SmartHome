from machine import Pin, SPI
from max7219 import Max7219

# Initialisation
spi = SPI(1, baudrate=10000000)
screen = Max7219(8, 8, spi, Pin(15))

### CONNECTION ####
# The connection of the matrix display cannot be changed, do tp the SPI setup
# VCC to 5.5V
# GND to Ground
# DIN to GPIO13
# CS  to GPIO15
# CLK to GPIO14

# Break two-digit number down into 2 parts
# I know the displayOnes and displayTens method is coded kind of goofy,
# but this was not really possible in a more clever way due to the nature
# of the 8x8 matrix :D
def displayNumbers(number):
    screen.fill(0)
    numberStr = str(number)
    
    # Check if number is negative
    if number >= 0:
        # Check if number has 2 digits
        if len(numberStr) > 1:
            tens = numberStr[0]
            ones = numberStr[1]
            
            displayOnes(int(ones))
            displayTens(int(tens))
            
        else:
            displayOnes(number)
            displayTens(0)
            
    else:
        if number > -9:
            displayOnes(number * (-1))
            screen.hline(1,4,3,1)
        
        # Display -9 when number is smaller that -9
        else:
            displayOnes(9)
            screen.hline(1,4,3,1)
            
    screen.show()
    
    
def displayOnes(number):
    if number == 0:
        screen.vline(7,1,7,1)
        screen.vline(5,1,7,1)
        screen.pixel(6,1,1)
        screen.pixel(6,7,1) 
    elif number == 1:
        screen.vline(7,1,7,1)   
    elif number == 2:
        screen.hline(5,1,3,1)
        screen.hline(5,4,3,1)
        screen.hline(5,7,3,1)
        screen.vline(7,1,4,1)
        screen.vline(5,4,7,1) 
    elif number == 3:
        screen.hline(5,1,3,1)
        screen.hline(5,4,3,1)
        screen.hline(5,7,3,1)
        screen.vline(7,1,7,1) 
    elif number == 4:
        screen.vline(5,1,4,1)
        screen.vline(7,1,7,1)
        screen.pixel(6,4,1)
    elif number == 5:
        screen.hline(5,1,3,1)
        screen.hline(5,4,3,1)
        screen.hline(5,7,3,1)
        screen.vline(5,1,4,1)
        screen.vline(7,4,7,1)
    elif number == 6:
        screen.hline(5,1,3,1)
        screen.hline(5,4,3,1)
        screen.hline(5,7,3,1)
        screen.vline(5,1,7,1)
        screen.vline(7,4,7,1)
    elif number == 7:
        screen.vline(7,1,7,1)
        screen.hline(5,1,3,1)
    elif number == 8:
        screen.vline(7,1,7,1)
        screen.vline(5,1,7,1)
        screen.pixel(6,1,1)
        screen.pixel(6,7,1)
        screen.pixel(6,4,1)
    elif number == 9:
        screen.vline(7,1,7,1)
        screen.vline(5,1,4,1)
        screen.pixel(6,1,1)
        screen.pixel(6,4,1)
        
        
def displayTens(number):
    if number == 0:
        screen.vline(2,1,7,1)
        screen.vline(0,1,7,1)
        screen.pixel(1,1,1)
        screen.pixel(1,7,1) 
    elif number == 1:
        screen.vline(2,1,7,1)   
    elif number == 2:
        screen.hline(0,1,3,1)
        screen.hline(0,4,3,1)
        screen.hline(0,7,3,1)
        screen.vline(2,1,4,1)
        screen.vline(0,4,7,1) 
    elif number == 3:
        screen.hline(0,1,3,1)
        screen.hline(0,4,3,1)
        screen.hline(0,7,3,1)
        screen.vline(2,1,7,1) 
    elif number == 4:
        screen.vline(0,1,4,1)
        screen.vline(2,1,7,1)
        screen.pixel(1,4,1)
    elif number == 5:
        screen.hline(0,1,3,1)
        screen.hline(0,4,3,1)
        screen.hline(0,7,3,1)
        screen.vline(0,1,4,1)
        screen.vline(2,4,7,1)
    elif number == 6:
        screen.hline(0,1,3,1)
        screen.hline(0,4,3,1)
        screen.hline(0,7,3,1)
        screen.vline(0,1,7,1)
        screen.vline(2,4,7,1)
    elif number == 7:
        screen.vline(2,1,7,1)
        screen.hline(0,1,3,1)
    elif number == 8:
        screen.vline(2,1,7,1)
        screen.vline(0,1,7,1)
        screen.pixel(1,1,1)
        screen.pixel(1,7,1)
        screen.pixel(1,4,1)
    elif number == 9:
        screen.vline(2,1,7,1)
        screen.vline(0,1,4,1)
        screen.pixel(1,1,1)
        screen.pixel(1,4,1)