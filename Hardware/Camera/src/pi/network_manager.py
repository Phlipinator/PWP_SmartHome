import fcntl
from os import path, remove
import socket
import struct
import subprocess
import time

from state import State

class NetworkManager:
    def __init__(self, interface = 'wlan0', wpa_file = 'wpa.conf', hotspot_subnet = '10.0.0.5/24'):
        print("Init NetworkManager")
        self.interface = interface
        self.config_file = wpa_file
        self.hotspot_subnet = hotspot_subnet
        self.lan_ip = None
        self.state = 0
        #self.init_network(mode)
    

    def init_network(self, mode):
        if path.isfile(self.config_file):
            self.stop_hotspot()
            self.connect_wifi()
            self.check_wifi()
        else:
            if not self.check_hotspot(retry=False):
                self.disconnect_wifi()
                self.start_hotspot()

    def get_ip_from_wpa_status(self, stdout, prefix):
        for line in stdout:
            if line.startswith(prefix):
                return line[len(prefix):]

    def check_wifi(self, once=False, attempts=5, go_ap=True):
        matches = ['wpa_state=COMPLETED', 'ip_address']
        for i in range(1 if once else attempts):
            print("Checking wifi connection...")
            try:
                p = subprocess.run(['wpa_cli', '-i', self.interface, 'status'], check=False, capture_output=True)
                decoded = p.stdout.decode("utf-8")
                if all([x in decoded for x in matches]):
                    print('Successful connected to wifi')
                    self.state = State.LAN
                    break
            except subprocess.CalledProcessError as e:
                print("Received non zero exit code from subprocess!")
                print(e)
            except:
                print("Unknown error!")
            if not once: time.sleep(5)

        if self.state != State.LAN and go_ap:
            print("Failed to connect to wifi")
            # go ap mode
            self.disconnect_wifi()
            self.start_hotspot()
        return True if self.state == State.LAN else False

    def check_hotspot(self, retry=True):
        print("Checking hotsport...")
        #matches = ['ip_address=' + self.hotspot_subnet[:-3]]
        matches = ['Failed to connect to non-global ctrl_ifname']
        try:
            subprocess.run(['systemctl', 'is-active', '--quiet', 'dnsmasq'], check=False) 
            subprocess.run(['systemctl', 'is-active', '--quiet', 'hostapd'], check=False)
            p = subprocess.run(['wpa_cli', '-i', self.interface, 'status'], check=False, capture_output=True)
            if all([x in p.stderr.decode("utf-8") for x in matches]):
                print('Successful started hotspot')
                self.state = State.AP
        except subprocess.CalledProcessError as e:
            #print("Received non zero exit code from subprocess!!!")
            print(e)
        except:
            print("Unknown error!")

        if self.state != State.AP and retry: 
            self.disconnect_wifi()
            self.start_hotspot()
            
        return True if self.state == State.AP else False

    def connect_wifi(self):
        print("Connecting to wifi")
        try:
            subprocess.run(['wpa_cli', 'terminate'])
            subprocess.run(['wpa_supplicant', '-B', '-i', self.interface, '-c', self.config_file])
            subprocess.run(['dhcpcd', '-n', self.interface], check=True)
        except subprocess.CalledProcessError:
            print("Received non zero exit code from subprocess!")
        except:
            print("Unknown error!")
    
    def disconnect_wifi(self):
        print("Disconnecting to wifi")
        try:
            #subprocess.run(['wpa_cli', '-i', self.interface, 'disconnect'], check=True)
            subprocess.run(['wpa_cli', 'terminate'])
            subprocess.run(['dhcpcd', '-k', self.interface], check=True)
        except subprocess.CalledProcessError:
            print("Received non zero exit code from subprocess!")
        except:
            print("Unknown error!")
    
    def start_hotspot(self):
        print("Starting hotspot")
        try:
            #subprocess.run(['ip', 'link', 'set', 'dev', self.interface, 'up'], check=True)
            subprocess.run(['systemctl', 'start', 'hostapd'], check=True)
            subprocess.run(['ip', 'a', 'add', self.hotspot_subnet, 'brd', '+', 'dev', self.interface], check=True)
            subprocess.run(['systemctl', 'start', 'dnsmasq'], check=True)
        except subprocess.CalledProcessError:
            print("Received non zero exit code from subprocess!")
        except:
            print("Unknown error!")
    
    def stop_hotspot(self):
        try:
            print("Stopping hotspot")
            out = subprocess.run(['systemctl', 'stop', 'dnsmasq'], check=True)
            out = subprocess.run(['systemctl', 'stop', 'hostapd'], check=True)
            out = subprocess.run(['ip', 'a', 'flush',  'dev', self.interface], check=True)
        except subprocess.CalledProcessError:
            print("Received non zero exit code from subprocess!")
        except:
            print("Unknown error!")

    def scan_wifi(self):
        print('Scanning wifi...')
        try:
            ps = subprocess.run(['iw', 'dev', self.interface, 'scan'], check=True, capture_output=True)
            out = subprocess.run(['sed', '-En', 's/^[ \t]*SSID://p'], input=ps.stdout, check=True, capture_output=True)
            #return out.stdout.decode('utf-8').strip().splitlines()
            #return out.stdout.decode('utf-8').splitlines().
            return [y for y in (x.strip() for x in out.stdout.decode('utf-8').splitlines()) if y]
        except subprocess.CalledProcessError:
            print("Received non zero exit code from subprocess!")
            return []
        except:
            print("Unknown error!")
            return []
    
    def set_wifi(self, ssid, psk):
        print("===========================")
        print("Rein in die Olga")
        print("ssid: " + ssid)
        print("psk: " + psk)
        conf = open(self.config_file, 'w')
        print("Opened config:")
        print(conf)
        lines = [
            'ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\n\n',
            'network={\n',
            f'    ssid="{ssid}"\n',
            f'    psk="{psk}"\n',
            '}\n'
        ]
        conf.writelines(lines)
        conf.close()

        self.stop_hotspot()
        self.connect_wifi()
        if not self.check_wifi():
            remove(self.config_file)
    
    def get_ip(self, ifname):
        for i in range(3):
            try:
                p = subprocess.run(['wpa_cli', '-i', self.interface, 'status'], check=True, capture_output=True)
                decoded = p.stdout.decode("utf-8").splitlines()
                hasIp = self.get_ip_from_wpa_status(decoded, "ip_address=")
                if hasIp:
                    self.lan_ip = hasIp
                    break
            except:
                print("Couldn't get IP")
                time.sleep(.5)
        
        return self.lan_ip
        #s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        #for i in range(3):
        #    try:
        #        self.lan_ip = socket.inet_ntoa(fcntl.ioctl(
        #        s.fileno(),
        #        0x8915,  # SIOCGIFADDR
        #        struct.pack('256s', bytes(self.interface[:15], 'utf-8'))
        #        )[20:24])
        #        break
        #    except:
        #        print("Couldn't get IP")
        #        time.sleep(.5)
        
        #return self.lan_ip
