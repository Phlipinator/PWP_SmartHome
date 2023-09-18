from machine import Pin, ADC, PWM
from time import sleep
from dcmotor import DCMotor

# -- Raspi_Output=Esp_Input 2-bit Communication -- #
in0 = Pin(23, Pin.IN)
in1 = Pin(22, Pin.IN)

# -- Raspi_Input=Esp_Output 2-bit Communication -- #
out0 = Pin(4, Pin.OUT)
out1 = Pin(0, Pin.OUT)

# -- Poti -- #
wiper = ADC(Pin(34))
wiper.atten(ADC.ATTN_11DB)
wiper.width(wiper.WIDTH_12BIT)

# -- LED's -- #
led_off = Pin(15, Pin.OUT) # red
led_ap = Pin(2, Pin.OUT) # yellow
led_ln = Pin(16, Pin.OUT) # blue
led_fi = Pin(17, Pin.OUT) # green

# -- DC-Motor -- #
# forward = down to off // backwards = up to full_internet
dc_frequency = 100
dc_speed = 100
dc_pin1 = Pin(32, Pin.OUT)    
dc_pin2 = Pin(33, Pin.OUT)     
enable = PWM(Pin(25), dc_frequency)
dc_motor = DCMotor(dc_pin1, dc_pin2, enable)

# -- Modes Poti Variables -- #
off = 4095
ap = 3000
ln = 1400
fi = 0

OFF = 0
AP  = 1
LAN = 2
WAN = 3
    # < 450 internet
    # < 2100 wifi
    # < 4095 ap
    # 4095 offline
BOUNDARY = [4095, 4094, 2100, 450]
S_OFF = 4095
S_AP  = 3000
S_LAN = 1400
S_WAN = 0

def set_led(mode):
    led_off.value(0)
    led_ap.value(0)
    led_ln.value(0)
    led_fi.value(0)
    if   mode == OFF: led_off.value(1)
    elif mode == AP : led_ap.value(1)
    elif mode == LAN: led_ln.value(1)
    elif mode == WAN: led_fi.value(1)
    
def set_mode(mode):
    v0 = mode & 1
    v1 = (mode >> 1) & 1
    out1.value(v1)
    out0.value(v0)

def get_slider():
    val = wiper.read()
    mode = None
    if   val < BOUNDARY[WAN]: mode = WAN
    elif val < BOUNDARY[LAN]: mode = LAN
    elif val < BOUNDARY[AP]:  mode = AP
    else: mode = OFF
    return mode

def get_mode():
    v0 = in0.value()
    v1 = in1.value()
    mode = (v1<<1)+v0
    return mode

def move(dst, speed):
    pos = wiper.read()
    while(pos > dst):
        dc_motor.backwards(speed)
        pos = wiper.read()
    while(pos < dst):
        dc_motor.forward(speed)
        pos = wiper.read()

def set_slider(mode):
    if   mode == WAN: move(S_WAN, dc_speed)
    elif mode == LAN: move(S_LAN, dc_speed)
    elif mode == AP:  move(S_AP,  dc_speed)
    elif mode == OFF: move(S_OFF, dc_speed); sleep(.1)
    dc_motor.stop()
    set_led(mode)



prev_slider = None
curr_slider = None

prev_pin = None
curr_pin = None
timeout = 2

while True:
    curr_slider = get_slider()
    curr_pin = get_mode()
    # slider changed
    if (prev_slider is not None and prev_slider != curr_slider):
        print("slider changed! prev: " + str(prev_slider) + " curr: " + str(curr_slider))
        set_mode(curr_slider)
        curr_pin = curr_slider
        set_led(curr_slider)
    # pin changed
    elif (prev_pin is not None and prev_pin != curr_pin):
        print("pins changed! prev: " + str(prev_pin) + " curr: " + str(curr_pin))
        curr_slider = curr_pin
        set_slider(curr_slider)
        set_mode(curr_slider)
        
    prev_slider = curr_slider
    prev_pin = curr_pin
    sleep(0.3)
