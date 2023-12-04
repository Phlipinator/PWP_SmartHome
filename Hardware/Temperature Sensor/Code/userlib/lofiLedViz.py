from machine import Pin  # type: ignore

p0 = Pin(22, Pin.OUT)
p1 = Pin(23, Pin.OUT)

def visualizeTempState(newState):
    newState = int(newState)
    
    if (newState == 0):
        p0.value(0)
        p1.value(0)
    elif (newState == 1):
        p0.value(0)
        p1.value(1)
    elif (newState == 2):
        p0.value(1)
        p1.value(0)
    elif (newState == 3):
        p0.value(1)
        p1.value(1)
    else:
        print('Error: Received invalid state ${newState}. Aborting visualization thereof.')
        return