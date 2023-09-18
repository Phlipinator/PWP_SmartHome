import express from 'express'
import dotenv from 'dotenv'
import { Logger } from '../util/logger'

const mqtt = require('mqtt')

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
const knownThermostatDevices = {
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
}

const knownCameraDevices = {
    camera: {
        id: '12345',
        deviceType: 'CAMERA',
        name: 'Camera',
        stateOutTopic: 'pwpCameraState',
        stateInTopic: 'CameraState',
        data: {
            mode: 3,
            streamUrl: 'Sag ich nicht lol',
        },
    },
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
    subscribeToTopic('pwpCameraState')
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
            knownThermostatDevices.temperatureSensor.data.mode = parseInt(message.toString())
            break
        case 'pwpTemperatureSensor':
            Logger.mqtt('Received data update for temperature sensor')
            const data = JSON.parse(message.toString())
            knownThermostatDevices.temperatureSensor.data.temperature.value = parseInt(
                data.temperature,
            )
            knownThermostatDevices.temperatureSensor.data.humidity.value = parseInt(data.humidity)
            knownThermostatDevices.temperatureSensor.data.pressure.value = parseInt(data.pressure)
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
    const thermostatDevices = Object.values(knownThermostatDevices).map((device) => {
        return { id: device.id, name: device.name, mode: device.data.mode }
    })
    const cameraDevices = Object.values(knownCameraDevices).map((device) => {
        return { id: device.id, name: device.name, mode: device.data.mode }
    })
    res.send({ devices: [...thermostatDevices, ...cameraDevices] })
})

// GET details of a specific thermostat device
router.get('/thermostat/details', (req, res) => {
    Logger.express('GET /devices/thermostat/details')
    const deviceID = req.query.deviceId
    if (deviceID === undefined) {
        res.status(400).send('Missing deviceId')
        return
    }

    const device = Object.values(knownThermostatDevices).find((device) => device.id === deviceID)
    if (device === undefined) {
        res.status(400).send('Unknown deviceId')
        return
    }
    Logger.debug('Device:')
    console.log(device)

    const response: { id: string; mode: number; data?: any } = {
        id: device.id,
        mode: device.data.mode,
    }

    if (device.data.mode != 3) {
        res.send(response)
        return
    }

    const timestamp = Date.now()
    response.data = {
        timestamp: timestamp.toString(),
        temperature: {
            value: device.data.temperature.value,
            unit: device.data.temperature.unit,
        },
        humidity: {
            value: device.data.humidity.value,
            unit: device.data.humidity.unit,
        },
        pressure: {
            value: device.data.pressure.value,
            unit: device.data.pressure.unit,
        },
    }

    res.send(response)
})

// GET details of a specific camera device
router.get('/camera/details', (req, res) => {
    Logger.express('GET /devices/camera/details')
    const deviceID = req.query.deviceId
    if (deviceID === undefined) {
        res.status(400).send('Missing deviceId')
        return
    }

    const device = Object.values(knownCameraDevices).find((device) => device.id === deviceID)
    if (device === undefined) {
        res.status(400).send('Unknown deviceId')
        return
    }
    Logger.debug('Device:')
    console.log(device)

    const response: { id: string; mode: number; data?: any } = {
        id: device.id,
        mode: device.data.mode,
    }

    if (device.data.mode != 3) {
        res.send(response)
        return
    }

    const timestamp = Date.now()
    response.data = {
        timestamp: timestamp.toString(),
        streamUrl: device.data.streamUrl,
    }

    res.send(response)
})

// POST device connection mode
router.post('/setConnectionMode', (req, res) => {
    Logger.express('POST /devices/setConnectionMode')
    const deviceID = req.query.deviceId
    console.log(req.body)
    const mode = parseInt(req.body.connectionMode)

    if (deviceID === undefined) {
        res.status(400).send('Missing deviceId in query')
        return
    }

    if (mode === undefined) {
        res.status(400).send('Missing connectionMode in body')
        return
    }

    const device = Object.values(knownCameraDevices).find((device) => device.id === deviceID)
    if (device === undefined) {
        res.status(400).send('Unknown deviceId')
        return
    }

    if (mode < 0 || mode > 3) {
        res.status(400).send('Invalid mode')
        return
    }

    Logger.debug('Device:')
    console.log(device)

    // Publish new state
    Logger.mqtt('Publishing new state to topic "TemperatureSensorState"')
    client.publish('TemperatureSensorState', mode.toString())

    res.status(200).send('OK')
})

export default router
