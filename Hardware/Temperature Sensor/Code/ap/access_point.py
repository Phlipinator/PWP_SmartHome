import _thread
from ap.captive_portal import CaptivePortal


class AccessPoint():

    def __init__(self):
        self.portal = CaptivePortal()

    def start(self):
        self.portal = CaptivePortal()
        _thread.start_new_thread(self.portal.startCaptivePortal,())

    def stop(self):
        self.portal.closeAll()
        
    def getCredentials(self):
        return self.portal.getCredentials()

    def setCredentials(self,ssid,pw):
        self.portal.setCredentials(ssid,pw)
        self.portal.htmlBuilder.ssid = ssid
        self.portal.htmlBuilder.pw = pw
        self.portal.htmlBuilder.writeToIndex()

    def setSensorData(self,value1,value2,value3):
        self.portal.htmlBuilder.value1 = value1
        self.portal.htmlBuilder.value2 = value2
        self.portal.htmlBuilder.value3 = value3
        self.portal.htmlBuilder.writeToIndex()










