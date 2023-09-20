import env
# ESP network functionality
import network # type: ignore

import time

# Initialize the WLAN access station.
station = network.WLAN(network.STA_IF)

# Enable WLAN connectivity and connect to the router specified within the env.py file.
def enableWLAN():
    # Network credentials are handled via the access point interface.
    ssid = env.NW_SSID
    password = env.NW_PW

    station.active(True)
    station.connect(ssid, password)

    # TODO Abort after x failed attempts / x time
    while station.isconnected() == False:
        time.sleep_ms(50)

    print('WLAN connection successful')
    print(station.ifconfig())
    # End network connection procedure (if we get here we can assume we're connected).

# Disconnect from the current WLAN connection and disable WLAN connectivity.
def disableWLAN():
    station.disconnect()
    station.active(False)
    print('WLAN connection terminated')