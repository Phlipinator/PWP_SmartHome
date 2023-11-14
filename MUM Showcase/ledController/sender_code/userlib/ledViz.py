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