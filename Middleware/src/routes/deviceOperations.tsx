import express from 'express'
const mqtt = require('mqtt')
import dotenv from 'dotenv'
import { Logger } from '../util/logger'

dotenv.config()

const router = express.Router()

// CONSTANTS
const mqttHost = process.env.MQTT_HOST
if (mqttHost === undefined) {
    Logger.error('MQTT_HOST is undefined in environment variables')
    process.exit(1)
}

const mqttPort = process.env.MQTT_PORT
if (mqttPort === undefined) {
    Logger.error('MQTT_PORT is undefined in environment variables')
    process.exit(1)
}

const mqttUsername = process.env.MQTT_USERNAME
if (mqttUsername === undefined) {
    Logger.error('MQTT_USERNAME is undefined in environment variables')
    process.exit(1)
}

const mqttPassword = process.env.MQTT_PASSWORD
if (mqttPassword === undefined) {
    Logger.error('MQTT_PASSWORD is undefined in environment variables')
    process.exit(1)
}

// DEVICE INFO
const knownDevices = {
    temperatureSensor: {
        id: '67890',
        deviceType: 'THERMOSTAT',
        name: 'Temperature Sensor',
        dataTopic: 'pwpTemperatureSensor',
        stateOutTopic: 'pwpTemperatureSensorState',
        stateInTopic: 'TemperatureSensorState',
        data: {
            mode: 0,
            temperature: {
                value: 0,
                unit: '°C',
            },
            humidity: {
                value: 0,
                unit: '%',
            },
            pressure: {
                value: 0,
                unit: 'hPa',
            },
        },
    },
    // TODO: Add camera
}

const test = {
    mode: 0,
    deviceData: {},
}

// MQTT SETUP
Logger.mqtt('Connecting to MQTT broker...')
// Connect to broker with username and password
const client = mqtt.connect(`mqtt://${mqttHost}:${mqttPort}`, {
    username: mqttUsername,
    password: mqttPassword,
})

client.on('connect', () => {
    Logger.mqtt('Connected to MQTT broker')
    subscribeToTopic('pwpTemperatureSensor')
    subscribeToTopic('pwpTemperatureSensorState')
})

client.on('error', (err: any) => {
    console.error('MQTT error')
    console.error(err)
})

client.on('message', (topic: string, message: any) => {
    Logger.mqtt(`Received message from topic "${topic}":`)
    Logger.mqtt(message.toString())
    switch (topic) {
        case 'pwpTemperatureSensorState':
            Logger.mqtt('Received state update for temperature sensor')
            knownDevices.temperatureSensor.data.mode = parseInt(message.toString())
            break
        case 'pwpTemperatureSensor':
            Logger.mqtt('Received data update for temperature sensor')
            const data = JSON.parse(message.toString())
            knownDevices.temperatureSensor.data.temperature = data.temperature
            knownDevices.temperatureSensor.data.humidity = data.humidity
            knownDevices.temperatureSensor.data.pressure = data.pressure
            break
    }
})

// HELPER METHODS
const subscribeToTopic = (topic: string) => {
    Logger.mqtt(`Subscribing to topic "${topic}"...`)
    client.subscribe(topic, (err: any) => {
        if (err) {
            Logger.error(`Couldn't subscribe to topic "${topic}":`)
            Logger.error(err)
        } else {
            Logger.mqtt(`Subscribed to topic "${topic}"`)
        }
    })
}

const initDeviceInfos = () => {}

// ROUTES
// GET list of all devices
router.get('/', (req, res) => {
    Logger.express('GET /devices')
    const devices = Object.values(knownDevices).map((device) => {
        return { id: device.id, name: device.name, mode: device.data.mode }
    })
    res.send({ devices: devices })
})

// GET details of a specific device
router.get('/details', (req, res) => {
    Logger.express('GET /devices/details')
    const deviceID = req.query.deviceID
    if (deviceID === undefined) {
        res.status(400).send('Missing deviceID')
        return
    }
})

export default router