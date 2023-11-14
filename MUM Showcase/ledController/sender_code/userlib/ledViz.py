# Requires that a WLAN interface is already active.
# Since this probably happened elsewhere already we omit this here. The code would be:
# sta = network.WLAN(network.STA_IF)  # Or network.AP_IF
# sta.active(True)

# For handling everything regarding ESPNow.
import userlib.espnowClient as espnow

# DEFINITIONS ----------
def sendMsg(target, msg):
    espnow.sendMessage(target,msg)

def initialize():
    print('Initializing EPSNow ledVisualization...')
    espnow.initESPNow()
    espnow.addPeer(espnow.leftLedController)
    espnow.addPeer(espnow.rightLedController)

# Mapping which IDs belong to which ESP
LEFT_IDS = [13,31,23,32,36,63]
RIGHT_IDS = [24,42,25,52,46,64,56,65]
# Checks if a valid ledCode is given and passes it on to the correct ESP via ESPnow if so.
def visualize(ledCode):
    ledCode = str(ledCode)  # Convert input to a string (so ints can be passed as well.)
    # Check if the input is a valid ledCode.
    # Could be disabled if performance is detrimental.
    if not ledCode.isdigit() or len(ledCode) != 3 or (ledCode[2] not in ['0', '1']):
        print("Error: Input is not a valid ledCode (3-digit number with 1 or 0 at the end).")
        return

    # Check if the first two digits are in LEFT_IDS or RIGHT_IDS
    first_two_digits = int(ledCode[:2])

    if first_two_digits in LEFT_IDS:
        sendMsg(espnow.leftLedController,ledCode)
    elif first_two_digits in RIGHT_IDS:
        sendMsg(espnow.rightLedController,ledCode)
    else:
        print("Error: No ESP handles this ledCode.")


# Helper functions so no parsing state > stream has to be done outside of this module
# Parser for the TemperatureSensor:
currentTempState = -1
def visualizeTempState(newState):
    newState = int(newState)
    global currentTempState
    
    if (newState == 0):
        pass
    elif (newState == 1):
        visualize(421)
    elif (newState == 2):
        visualize(461)
        visualize(631)
        visualize(321)
    elif (newState == 3):
        visualize(461)
        visualize(631)
        visualize(321)
        visualize(311)
    else:
        print('Error: Received invalid state ${newState}. Aborting visualization thereof.')
        return
    
    if (currentTempState == 1):
        visualize(420)
    elif (currentTempState == 2):
        visualize(460)
        visualize(630)
        visualize(320)
    elif (currentTempState == 3):
        visualize(460)
        visualize(630)
        visualize(320)
        visualize(310)

    currentTempState = newState

# Parser for the Cam:
currentCamState = -1
def visualizeCamState(newState):
    newState = int(newState)
    global currentCamState
    
    if (newState == 0):
        pass
    elif (newState == 1):
        visualize(521)
    elif (newState == 2):
        visualize(561)
        visualize(631)
        visualize(321)
    elif (newState == 3):
        visualize(561)
        visualize(631)
        visualize(321)
        visualize(311)
    else:
        print('Error: Received invalid state ${newState}. Aborting visualization thereof.')
        return
    
    if (currentTempState == 1):
        visualize(520)
    elif (currentTempState == 2):
        visualize(560)
        visualize(630)
        visualize(320)
    elif (currentTempState == 3):
        visualize(560)
        visualize(630)
        visualize(320)
        visualize(310)

    currentTempState = newState