# A module within which we handle all the MQTT functionality we are using.

from userlib.umqttsimple import MQTTClient
import machine  # type: ignore
import ubinascii # type: ignore
import json
import time

# Import environment variables
import env

# We create an MQTT client with the ESP's unique ID
CLIENT_ID = ubinascii.hexlify(machine.unique_id())

client = None

# Are we connected to a broker?
isConnected = False


# Resets the ESP on failed connection in order to try again later.
def restart_and_reconnect(delaySeconds=10):
    print('Failed to connect to MQTT broker. Reconnecting...')
    time.sleep(delaySeconds)
    machine.reset()

# Sets up an MQTT client with the provided callback for handling incoming messages.
# Must be called before any other functions!
def initClient(subscription_callback):
    global CLIENT_ID, client
    client = MQTTClient(CLIENT_ID, env.MQTT_SERVER, env.MQTT_PORT, env.MQTT_USER, env.MQTT_PW, 30)
    client.set_callback(subscription_callback)
    
    print('Establishing MQTT connection...')
    startMQTT()

# Initialize our MQTT connection
def startMQTT():
    try:
        connect() # Connect to broker
        print('MQTT connection successful!')

        # Subscribe to the inc. State Topic
        subscribeTopic(env.DATAVIZ_TOPIC)

    except OSError as e:
        print('Failed MQTT connection with error: %s' % e)
        # TODO Maybe less heavyhanded errorhandling
        restart_and_reconnect() # Try again later on fail.

# Connects to the MQTT broker specified within the mqtt_server variable as specified in env.py.
# Must be called beofre the below functions.
def connect():
    # (Debugging) Print the client object to the console with variable names and contents
    # print('Client used to connect: ')
    # printObject(client)    
    client.connect()
    print('Connected to MQTT broker: ' + env.MQTT_SERVER)
    global isConnected
    isConnected = True


# disconnects the MQTT client from the Broker
def disconnect():
    client.disconnect()
    print('Disconnected from MQTT broker: ' + env.MQTT_SERVER)
    global isConnected
    isConnected = False

# Publishes SensorData to the TemperatureSensor Topic in JSON format
def publishData(temp, hum, pres):
    client.publish(env.DATA_TOPIC, json.dumps({"temperature": str(temp), "humidity": str(hum), "pressure": str(pres)}))

# Publishes a message to all topics listed in topics2pub.
def publishState(state):
    client.publish(env.STATE_TOPIC_OUT, str.encode(str(state)))
    
# Subscribes to a topic on the connected MQTT broker. 
def subscribeTopic(topic):
    client.subscribe(topic)
    print('Subscribed to topic: ' + str(topic))

# Tries reading available messages and reboots on crash.
def read():
    # Check whether a pending message from the server is available. If yes they are delivered to the callback function specified above.
    client.check_msg()

# Debugging function that allows printing all attributes + values of a python object
def printObject(ob):
    for attr in dir(ob):
        if not attr.startswith('__'):
            value = getattr(ob, attr)
            print(f"{attr}: {value}")