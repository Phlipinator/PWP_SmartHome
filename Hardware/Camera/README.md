# PiCam
Security Camera, which can operate on 4 different connectivity levels.

Keep in mind, the cam only works as expected if esp & pi are connected correctly.
Otherwise you will see no slider movement or weird jumping between the states.
Additionally the app must be executed as root because we are modifying network interfaces and starting/stopping services.

The software works on a PI zero but the performance isn't great.
We recommend a more powerful version, because the motion detection is quite compute intensive & we spawn multiple threads. PI 3 works nice!

## Features & connectivity levels:

| Feature | Avail. | Description |
| ---     | --- | ---         |
| Slider | 0-3 | Change state |
| Motion detection | 0-3 | Store a 10sec. video as mp4 |
| PI Web UI | 1-3 | Set state, configure wifi, show live cam |
| Video stream | 1-3 | You can get a live stream by calling http://<IP_OF_PI>:8888/mystream/ (HLS) or http://<IP_OF_PI>:8889/mystream/ (WebRTC)
| MQTT | 2-3 | Send or receive state changes |
| MP4 files | - | You can get the videos by putting the sd card into a device which can read `ext4` or via scp (FileZilla or WinSCP)


**Offline (0)**:
No network connectivity.
Only the motion detection (stored as mp4) is working.

**Access Point (1)**:
The PI creates a hotspot which you can connect to.
You can access the webinterface via http://10.0.0.5 and for example configure a wifi to connect to.
Anyway all requests should be redirected to this address.

**LAN (2)**:
The PI connects to the configured WiFi.
You can access the webinterface & the livestream within the network.
MQTT communication with local homeassistant also works

**Online (3)**:
From the PI perspective no difference to LAN state.
In this state the middleware proxys requests from WAN.


## Getting started
 - Satisfy prerequisites
 - follow installation steps
 - Create a `config.cfg` file in the apps root dir similar to [config.sample](./src/pi/config.sample)
 - Hook up the Pins as shown in the [circuit diagram](./doc/img/circuit.png)
 - Start the app on the PI by switching into the apps root dir and executing: `sudo flask run --host=0.0.0.0`


 ## Prerequisites
  - Rasbian version >= Bullseye
  - Python version >= 3.9 (with pip)

## Installation
### ESP
Just copy the files from [./src/esp/](./src/esp/) onto the device

### PI

**Additional software**:
| Software | Usage |
| ---      | ---   |
| hostapd | Accesspoint |
| dnsmasq | DHCP & DNS for accesspoint |
| ffmpeg   | Video output (mp4 & stream to local rtsp-server) |
| rtsp-simple-server | Video streaming server |

Install via package manager:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install ffmpeg hostapd dnsmasq
```

We had trouble getting the cam to work in a venv.
Therefore install the following packages as root:
```bash
pip install flask paho-mqtt picamera2 RPi.GPIO
```

Get latest release of rtsp server
```bash
wget -qO- https://github.com/aler9/rtsp-simple-server/releases/download/v0.21.5/rtsp-simple-server_v0.21.5_linux_armv7.tar.gz | tar -xz
```

Set Wifi Country in `raspi-config`
Copy the files from [./src/pi/](./src/pi/) onto the PI

create hostapd config:
```bash
cat > /etc/hostapd/hostapd.conf << EOF
interface=wlan0
driver=nl80211
ssid=PiCam
hw_mode=g
channel=8
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=1234567890
wpa_key_mgmt=WPA-PSK
wpa_pairwise=CCMP TKIP
rsn_pairwise=CCMP
EOF
```

enable config:
```bash
cat > /etc/default/hostapd << EOF
DAEMON_CONF="/etc/hostapd/hostapd.conf"
EOF
```

dnsmasq
```bash
cat >> /etc/dnsmasq.conf << EOF
interface=wlan0                         # Use interface wlan0 
no-dhcp-interface=eth0                  # Don't use interface eth0 
bind-interfaces                         # Bind to the interfaces 
domain-needed                           # Don't forward short names 
bogus-priv                              # Never forward addresses in the non-routed address spaces 
dhcp-range=10.0.0.50,10.0.0.150,12h     # Address range & lease. Needs to be in sync with config.cfg
address=/#/10.0.0.5                     # Redirect all DNS to this IP 
EOF
```

dhcpcd
```bash
cat >> /etc/dhcpcd.conf << EOF
nohook wpa_supplicant
EOF
```

configure services
```bash
sudo systemctl disable dnsmasq
sudo systemctl unmask hostapd
sudo systemctl disable hostapd
```