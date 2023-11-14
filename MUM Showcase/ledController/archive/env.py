# This file serves as a place to store all the variables that might be specific (and potentially sensitive) to your environment.
# It is then imported and utilized in other places as specified in the comments for each variable.

# Network SSID & PW (Can be hardcoded here)
NW_SSID = 'Cudy-2C10'
NW_PW = '61005174'

# Data of the MQTT Broker you want to utilize.
# In our case it is a Home Assistant instance with the mosquitto addon (remember to open port 1883 in the corresponding router)
# Utilized in: userlib.mqttClient.py
MQTT_SERVER = 'philippsbroker.duckdns.org'
MQTT_PORT = 1883
MQTT_USER = 'mqtt_user'
MQTT_PW = 'mqtt-docker'

# The names of the MQTT topics we utilize.
# Utilized in: userlib.mqttClient.py and main.py
# The MQTT topic where changes to the data visualization get published to.
# Messages should be 3 character strings, with the combined datastreamID (see below) and a 1 for ON or 0 for OFF
# E.g.: 420 turns datastream 42 off. 561 turns datastream 56 on.
DATAVIZ_TOPIC = b'pwpDataViz'

# The LED stripe connections, that are connected to this ESP
# There are two IDs per connection between each of the devices, one per "direction" of data.
# The IDs are always two digit numbers, one digit per connected device.
# The first digit is the device where the data stream should start, one is where it should arrive.
# The IDs of the devices are as according to our presentation setup, from leftmost to rightmost then up to down.
# This means: 1 = Screen (outside) | 2 = Screen (inside) | 3 = Router | 4 = Cam | 5 = Thermometer | 6 = IoT Hub (Home Assistant)
# E.g. 34 refers to the stream of data from Router to Cam.
# For our setup this also means, that if a ESP serves connection 34, it also servers connection 43.
# For ease of use just comment in or out the right lines:
DATASTREAM_IDS = [13,31,23,32,36,63] # Left DataViz ESP
# DATASTREAM_IDS = [24,42,25,52,46,64,56,65] # Right DataViz ESP