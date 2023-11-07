import espnow # type: ignore # (Tells Pylance to ignore this problem.)
import _thread

e = None

leftLedController = b'\xc4\xde\xe2G0\xbc'   # MAC address of peer's wifi interface
rightLedController = b'\xc4\xde\xe2GR\xac'   # MAC address of peer's wifi interface

def initESPNow():
    global e
    e = espnow.ESPNow()
    e.active(True)

def addPeer(peer):
    e.add_peer(peer) # Must add_peer() before send()

def startListen():
    _thread.start_new_thread(getMessages, ())

def getMessages():
    while True:
        host, msg = e.recv()
        if msg:             # msg == None if timeout in recv()
            print(host, msg)
            if msg == b'end':
                break

def sendMessage(peer, msg):
    e.send(peer, msg, True)