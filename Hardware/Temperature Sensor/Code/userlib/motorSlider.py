# Author: Alexander Schmidt, https://github.com/alxschmidt
from machine import Pin, ADC, PWM  # type: ignore
import time

# This class offers functionality for easy interaction with a motorized linear potentiometer.
# It is implemented for the following model: RSA0N11M9-LIN10K
#   --> Datasheet: https://cdn-reichelt.de/documents/datenblatt/X200/401840_RSA0N11M9A04.pdf
#   --> Store Site (ger): https://www.reichelt.de/schiebepotentiometer-mono-10-kohm-linear-rsa0n11m9-lin10k-p73884.html
# Milage of this code for other models may vary.
# For driving the DC motor we make use of a L293D. Very helpful insight is provided here: https://lastminuteengineers.com/l293d-dc-motor-arduino-tutorial/


class MotorSlider:
    # Initialization for a MotorSlider requires to set all the Pins of the ESP32 where the Slider and the intermittent L293D are connected.
    # wiper_Pin: Pin # of connection to Pin 2 of the motorizedSlider according to the datasheet.
    #   --> Needs to be connected to a ADC enabled Pin of the ESP to allow analog read.
    #       --> This needs to be one of the ADC1_X pins when you also use WiFi (which we do), see: https://github.com/micropython/micropython-esp32/issues/33#issuecomment-301057875
    #   --> Regarding analog reading refer to: https://randomnerdtutorials.com/esp32-esp8266-analog-readings-micropython/ (code source for the analog reading parts)
    # enA_Pin: Pin # of connection to ENA pin of the L293D (Enable Pin A - motor activation and speed control). Needs to be PWM capable to control speed. For PWM read https://docs.micropython.org/en/latest/esp8266/tutorial/pwm.html
    # in1_Pin: Pin # of connection to In1 pin of the L293D. Together with In2 it controls the direction of the motor via the built in H-bridge.
    # in2_Pin: Pin # of connection to the aforementioned In2 pin of the L293D.
    def __init__(self, wiper_Pin, enA_Pin, in1_Pin, in2_Pin):
        self.pot = ADC(Pin(wiper_Pin))
        self.pot.atten(ADC.ATTN_11DB)

        # Initialize enA as a PWM pin
        self.enA = PWM(Pin(enA_Pin))
        self.enA.freq(50)  # Set frequency, e.g., 1000 Hz

        self.in1 = Pin(in1_Pin, Pin.OUT)
        self.in2 = Pin(in2_Pin, Pin.OUT)

    # Read the current resistance value of the slider potentiometer. Will be between 0 (100% down) and 4095 (100% up)
    def read(self):
        return self.pot.read()

    # Read the current position of the slider in percent (0% is all the way down, 100% all the way up).
    def readPCT(self):
        return (self.pot.read()/4095)

    # Returns the current state corresponding to the current sliderPosition out of the four possible states for our PWP temperature sensor.
    def readState(self):
        pos = self.readPCT()
        if pos > 0.834:
            return 3  # Online state
        elif pos > 0.5:
            return 2  # Local network state
        elif pos > 0.166:
            return 1  # Access point state
        else:
            return 0  # Offline / manual state

    # Supplying current to in1 and grounding in2 will move the slider down (away from the motor) when enabling enA.
    def moveDown(self, speed=512):
        self.in1.on()
        self.in2.off()
        self.enA.duty(speed)  # Set PWM duty cycle for speed control

    # Supplying current to in2 and grounding in1 will move the slider up (towards the motor) when enabling enA.
    def moveUp(self, speed=512):
        self.in1.off()
        self.in2.on()
        self.enA.duty(speed)  # Set PWM duty cycle for speed control

    # Theoretically grounding enA would suffice here, but we'll also ground in1 and in2 for future changes.
    def stopMove(self):
        self.enA.duty(0)  # Stop movement by setting duty cycle to 0
        self.in1.off()
        self.in2.off()

    # Moves the slider up (if up true) or down (if up false) for duration milliseconds and then stops again.
    def move(self, up, duration, speed=512):
        if up:
            self.moveUp(speed)
            time.sleep_ms(duration)
        else:
            self.moveDown(speed)
            time.sleep_ms(duration)
        self.stopMove()

    # Moves the slider to a specific position given in percent (as float) of up (0% is all the way down, 100% all the way up)
    def moveToPCT(self, target):
        # Clean up input out of bounds so motor doesn't lock up
        tar = target
        if (target > 1):
            tar = 1.0
        elif (target < 0):
            tar = 0.0
        # Move up as long as tar is still bigger than current position (if it was originally)
        if (tar > self.readPCT()):
            self.moveUp()
            while (tar > self.readPCT()):
                pass
            self.stopMove()
        # Else move down as long as target is still smaller than current position (if it was originally)
        elif (tar < self.readPCT()):
            self.moveDown()
            while (tar < self.readPCT()):
                pass
            self.stopMove()

        # TODO: PWM smooth movement curve to minimize mechanical stress
