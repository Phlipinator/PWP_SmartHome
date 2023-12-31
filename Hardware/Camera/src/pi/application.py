import configparser
from enum import IntEnum
from os import path
from queue import Queue
import threading
import time
from mqtt import Mqtt
from network_manager import NetworkManager
from state import State
from slider import Slider
from video import VideoStream
from streaming_output import VideoServer


class Application:
    def __init__(self, config):
        print("Starting App...")

        self.config = configparser.ConfigParser()
        self.config.read(config)

        self.inChange = False
        self.queue = Queue()

        self.slider = Slider(
            self.config.getint('slider', 'gpio_out0'),
            self.config.getint('slider', 'gpio_out1'),
            self.config.getint('slider', 'gpio_in0'),
            self.config.getint('slider', 'gpio_in1'),
            self.config.getfloat('slider', 'timeout'),
            self.queue
        )

        self.network = NetworkManager(
            self.config.get('network', 'interface'),
            self.config.get('network', 'config'),
            self.config.get('network', 'ap_net')
        )
        
        # self.video = VideoServer()
        # self.video.start()
        self.video = VideoStream(
            self.config.getboolean('video', 'motion_detection'),
            (
                self.config.getint('video', 'res_x'),
                self.config.getint('video', 'res_y')
            ),
            self.config.get('video', 'video_format'),
            (
                self.config.getint('video', 'low_res_x'),
                self.config.getint('video', 'low_res_y')
            ),
            self.config.get('video', 'stream_url'),
            self.config.get('video', 'directory'),
            self.config.get('video', 'file_prefix')
        )

        self.mqtt = Mqtt(
            self.config.get('mqtt', 'server'),
            self.config.getint('mqtt', 'port'),
            self.config.get('mqtt', 'subscribe'),
            self.config.get('mqtt', 'publish'),
            self.config.get('mqtt', 'user'),
            self.config.get('mqtt', 'password'),
            self.queue
        )
        
        self.queue.put({
            "state": 2,
            "is_local_change": False
        })
        #print("CHANGING NETWORK STATE")
        #self.queue.put(self.config.getint('network', 'state'))
        
        self.thread = threading.Thread(target=self.run, daemon=True)
        self.thread.start()

        # wait to switch into state read from config then start slider thread
        time.sleep(.5)
        self.slider.thread.start()


    def get_stream_url(self):
        if self.network.state == State.WAN:
            return f"{self.video.ngrok_url}/mystream"
        else:
            return f"http://{self.network.get_ip(self.network.interface)}:8889/mystream"
    

    def run(self):
        """single thread is responsible for mode changes
           otherwise we run into race conditions"""
        while True:
            self.set_state(self.queue.get())
            self.queue.task_done()
            
    
    def set_state(self, state_item):
        """switching logic between states"""
        state = state_item["state"]
        is_local_change = state_item["is_local_change"]

        if state == self.network.state:
            if self.slider.get_pins != self.network.state:
                self.slider.set_pins(self.network.state)
            print("Doing nothing: already in mode!")
            return
    
        if state not in iter(State):
            print("Doing noting: invalid mode: " + str(state))
            return
            
        if not False:
            self.slider.set_pins(state)
            print("MODE: " + str(state))
        
        if state == State.OFF:
            print("Going offline...")
            if self.network.state == State.AP:
                self.network.stop_hotspot()
            else:
                self.video.kill_ngrok_process()
                self.mqtt.single(state, self.get_stream_url())
                self.network.disconnect_wifi()
            self.network.state = State.OFF

        elif state == State.AP:
            print("Going AP...")
            #if not self.network.check_hotspot(retry=False):
            if self.network.state > State.OFF:
                self.mqtt.single(state, self.get_stream_url())
            self.video.kill_ngrok_process()
            self.network.disconnect_wifi()
            time.sleep(.5)
            self.network.start_hotspot()
            self.network.check_hotspot(False)
            #neu von Michi
            self.network.state = State.AP

        else: # checked if state is valid --> must be LAN or WAN
            print("Going WiFi...")
            if not self.network.check_wifi(once=True, go_ap=False):
                # if valid config file
                if not path.isfile(self.network.config_file):
                    print("No valid config found! Falling back to AP mode")
                    self.queue.put({
                        "state": State.AP,
                        "is_local_change": False
                    })
                    #self.slider.set_pins(State.AP)
                    return
                self.network.stop_hotspot()
                self.network.connect_wifi()
                if not self.network.check_wifi(go_ap=False):
                    print("Couldn't connect to wifi! It's not in range or wrong SSID or password")
                    self.queue.put({
                        "state": State.AP,
                        "is_local_change": False
                    })
                    return
                    #if self.network.check_hotspot():
                    #    self.network.state = State.AP
                    #    self.slider.set_pins(State.AP)

                    #self.queue.queue.clear()
                    #self.queue.put(State.AP)
            if state == State.LAN:
                self.video.kill_ngrok_process()
            else:
                self.video.start_ngrok_tunnel(8889)
            
            # TODO: crashes here if failes to connect to wifi
            self.mqtt.connect()
            self.network.state = state
            self.mqtt.publish(state, self.get_stream_url())
        
