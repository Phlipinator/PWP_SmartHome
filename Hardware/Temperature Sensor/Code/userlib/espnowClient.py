import espnow # type: ignore # (Tells Pylance to ignore this problem.)

e = None

leftLedController = b'\xc4\xde\xe2G0\xbc'   # MAC address of peer's wifi interface
rightLedController = b'\xc4\xde\xe2G\x19\xa4'   # MAC address of peer's wifi interface

def initESPNow():
    global e
    e = espnow.ESPNow()
    e.active(True)

def addPeer(peer):
    e.add_peer(peer) # Must add_peer() before send()

def getMessage():
    return e.recv()

def sendMessage(peer, msg):
    e.send(peer, msg, True)