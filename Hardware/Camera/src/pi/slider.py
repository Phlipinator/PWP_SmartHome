import RPi.GPIO as GPIO
from time import sleep
from threading import Thread


class Slider:


    def __init__(
        self,
        out0, out1,
        in0, in1,
        timeout,
        queue
    ) -> None:
       self.out0 = out0
       self.out1 = out1
       self.in0 = in0
       self.in1 = in1
       self.timeout = timeout
       self.queue = queue
       self.thread = Thread(target=self.run, daemon=True)

       GPIO.cleanup()
       GPIO.setmode(GPIO.BCM)
       GPIO.setup(out0, GPIO.OUT)
       GPIO.setup(out1, GPIO.OUT)
       GPIO.setup(in0, GPIO.IN)
       GPIO.setup(in1, GPIO.IN)


    def run(self):
        """thread listening for slider changes"""
        print("Starting Slider thread...")
        prev = None
        while True:
            sleep(self.timeout)
            # bits to int
            curr = self.get_pins()
            if curr == prev:
                continue

            print("pins changed! prev: " + str(prev) + " curr: " + str(curr))
            self.queue.put({
                "state": curr,
                "is_local_change": True
            })
            prev = curr
    

    def set_pins(self, state):
        """converts dec state to bin & sets output pins"""
        GPIO.output(self.out1, (state >> 1) & 1)
        GPIO.output(self.out0, state & 1)
    

    def get_pins(self):
        """Reads input pins & return value in dec"""
        return (GPIO.input(self.in1) << 1) + GPIO.input(self.in0)
