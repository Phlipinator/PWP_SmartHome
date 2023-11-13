import json
import paho.mqtt.client as mqtt


class Mqtt:


    def __init__(self, host, port, sub_topic, pub_topic, user, password, queue):
        print("Init MQTT")
        self.host = host
        self.port = port
        self.sub_topic = sub_topic
        self.pub_topic = pub_topic
        self.user = user
        self.password = password
        self.queue = queue
        self.last_upstream = None
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        print(self.user)
        print(self.password)
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        self.client.username_pw_set(self.user, password=self.password)


    def on_connect(self, client, userdata, flags, rc):
        print("Connected with result code " + str(rc))
        client.subscribe(self.sub_topic)
    

    def on_disconnect(self, client, userdata, rc):
        print("MQTT: Disconnected!")


    def on_message(self, client, userdata, msg):
        """called, if entity state in homeassistant is changed by FE"""
        print(msg.payload)
        self.queue.put({
            "state": int(msg.payload),
            "is_local_change": False
        })


    def connect(self):
        print("MQTT CONNECT")
        """connects to homeassistant & starts mqtt thread"""
        print(self.host)
        print(self.port)
        print("===============MQTT=================")
        self.client.connect(str(self.host), self.port, 60)
        self.client.loop_start()


    def disconnect(self):
        """terminates mqtt thread & disconnects from homeassistant"""
        self.client.loop_stop()
        self.client.disconnect()
    

    def single(self, mode, url):
        """Publish a last message and disconnect afterwards"""
        self.client.loop_stop()
        self.publish(mode, url)
        self.client.disconnect()
    

    def publish(self, mode, url):
        print("Publish MQTT: " + str(mode) + " " + str(url))
        self.client.publish(self.pub_topic, json.dumps({"state": mode, "url": str(url)}), retain=True).wait_for_publish(1.5)
