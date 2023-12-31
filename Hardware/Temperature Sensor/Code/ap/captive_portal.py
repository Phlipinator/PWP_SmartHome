import gc
import network
import ubinascii as binascii
import uselect as select
import utime as time

from ap.captive_dns import DNSServer
from ap.captive_http import HTTPServer
from ap.credentials import Creds
from ap.setIndex import HtmlBuilder



class CaptivePortal:
    AP_IP = "192.168.4.1"
    AP_OFF_DELAY = const(10 * 1000)
    MAX_CONN_ATTEMPTS = 10

    def __init__(self, essid=None):
        self.local_ip = self.AP_IP
        self.sta_if = network.WLAN(network.STA_IF)
        self.ap_if = network.WLAN(network.AP_IF)
        self.is_running = True
        self.is_cp = True

        if essid is None:
            essid = b"ESP8266-%s" % binascii.hexlify(self.ap_if.config("mac")[-3:])
        self.essid = essid

        self.creds = Creds()
        self.htmlBuilder = HtmlBuilder()

        self.dns_server = None
        self.http_server = None
        self.poller = select.poll()

        self.conn_time_start = None

    def start_access_point(self):
        # sometimes need to turn off AP before it will come up properly
        self.ap_if.active(False)
        while not self.ap_if.active():
            print("Waiting for access point to turn on")
            self.ap_if.active(True)
            time.sleep(1)
        # IP address, netmask, gateway, DNS
        self.ap_if.ifconfig(
            (self.local_ip, "255.255.255.0", self.local_ip, self.local_ip)
        )
        self.ap_if.config(essid=self.essid, authmode=network.AUTH_OPEN)
        print("AP mode configured:", self.ap_if.ifconfig())

    def connect_to_wifi(self):
        print(
            "Trying to connect to SSID '{:s}' with password {:s}".format(
                self.creds.ssid, self.creds.password
            )
        )

        # initiate the connection
        self.sta_if.active(True)
        self.sta_if.connect(self.creds.ssid, self.creds.password)

        attempts = 1
        while attempts <= self.MAX_CONN_ATTEMPTS:
            if not self.sta_if.isconnected():
                print("Connection attempt {:d}/{:d} ...".format(attempts, self.MAX_CONN_ATTEMPTS))
                time.sleep(2)
                attempts += 1
            else:
                print("Connected to {:s}".format(self.creds.ssid))
                self.local_ip = self.sta_if.ifconfig()[0]
                print(self.local_ip)
                return True

        print(
            "Failed to connect to {:s} with {:s}. WLAN status={:d}".format(
                self.creds.ssid, self.creds.password, self.sta_if.status()
            )
        )
        # forget the credentials since they didn't work, and turn off station mode
        self.creds.remove()
        self.sta_if.active(False)
        return False

    def check_valid_wifi(self):
        if not self.sta_if.isconnected():
            if self.creds.load().is_valid():
                # have credentials to connect, but not yet connected
                # return value based on whether the connection was successful
                return self.connect_to_wifi()
            # not connected, and no credentials to connect yet
            return False

        if not self.ap_if.active():
            # access point is already off; do nothing
            return False

        # already connected to WiFi, so turn off Access Point after a delay
        if self.conn_time_start is None:
            self.conn_time_start = time.ticks_ms()
            remaining = self.AP_OFF_DELAY
        else:
            remaining = self.AP_OFF_DELAY - time.ticks_diff(
                time.ticks_ms(), self.conn_time_start
            )
            if remaining <= 0:
                self.ap_if.active(False)
                print("Turned off access point")
        return False

    def captive_portal(self):
        self.start_access_point()

        if self.http_server is None:
            self.http_server = HTTPServer(self.poller, self.local_ip,self.htmlBuilder)
            print("Configured HTTP server")
        if self.dns_server is None:
            self.dns_server = DNSServer(self.poller, self.local_ip)
            print("Configured DNS server")

        try:
            while True:
                if not self.is_running:
                    break
                gc.collect()
                # check for socket events and handle them
                for response in self.poller.ipoll(1000):
                    sock, event, *others = response
                    is_handled = self.handle_dns(sock, event, others)
                    if not is_handled:
                        self.handle_http(sock, event, others)

                if self.is_cp and self.check_valid_wifi():
                    print("Connected to WiFi!")
                    print(self.local_ip)
                    print(self.creds.ssid)
                    self.http_server.set_ip(self.local_ip, self.creds.ssid)
                    self.dns_server.stop(self.poller)
                    break

        except KeyboardInterrupt:
            print("Captive portal stopped")
        self.cleanup()

    def handle_dns(self, sock, event, others):
        if sock is self.dns_server.sock:
            # ignore UDP socket hangups
            if event == select.POLLHUP:
                return True
            self.dns_server.handle(sock, event, others)
            return True
        return False

    def handle_http(self, sock, event, others):
        self.http_server.handle(sock, event, others)

    def cleanup(self):
        print("Cleaning up")
        if self.dns_server:
            self.dns_server.stop(self.poller)
        gc.collect()

    def try_connect_from_file(self):
        print("try connect called")
        if self.creds.load().is_valid():
            if self.connect_to_wifi():
                return True

        # WiFi Connection failed - remove credentials from disk
        self.creds.remove()
        return False

    def startCaptivePortal(self):
        # turn off station interface to force a reconnect
        #print("start CP called")

        self.is_running = True
        self.is_cp = False
        self.sta_if.active(False)
        #if not self.try_connect_from_file():
        self.captive_portal() 

    def closeAll(self):
        self.is_running = False
        time.sleep(2)
        if self.http_server:
            self.http_server.sock.close()
        print("Http socket closed")
        #self.cleanup()
        time.sleep(1)

    def startDashboard(self):
        # turn off station interface to force a reconnect
        self.is_cp = False
        self.sta_if.active(False)
        self.captive_portal()

    def getCredentials(self):
        if self.creds.load().is_valid():
            return self.creds.ssid.decode("utf-8") , self.creds.password.decode("utf-8")

    def setCredentials(self,ssid,password):
        self.creds.ssid = ssid.encode('utf-8')
        self.creds.password = password.encode('utf-8')
        self.creds.write()