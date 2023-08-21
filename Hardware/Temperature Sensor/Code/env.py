# This file serves as a place to store all the variables that might be specific (and potentially sensitive) to your environment.
# It is then imported and utilized in other places as specified in the comments for each variable.

# Data of the MQTT Broker you want to utilize.
# In our case it is a Home Assistant instance with the mosquitto addon (remember to open port 1883 in the corresponding router)
# Utilized in: userlib.mqttClient.py
MQTT_SERVER = 'philipphomeassistant.duckdns.org'
MQTT_PORT = 1883
MQTT_USER = 'mqtt-user'
MQTT_PW = 'PhilippSmartHomeMQTT'

# The names of the MQTT topics we utilize.
# Utilized in: userlib.mqttClient.py and main.py
# The MQTT topic we publish the sensor data to.
DATA_TOPIC = b'pwpTemperatureSensor'
# The MQTT topic we publish state change requests to (when the state is changed on the device w/ slider / AP)
STATE_TOPIC_OUT = b'pwpTemperatureSensorState'
# The MQTT topic we receive state change instructions from (external state changes or confirmation for requests)
STATE_TOPIC_IN = b'TemperatureSensorState'

# Whether we are in Debug mode or not (i.e. ESP connected via USB)
# Debug mode disables the automated movement of the slider as the motor is not powered during USB connection.
# Utilized in main.py
DEBUG_MODE = False