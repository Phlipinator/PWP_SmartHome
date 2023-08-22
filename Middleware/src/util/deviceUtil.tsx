// Maps every device to list
import { HassEntity } from 'home-assistant-js-websocket'

// List of relevant device infos
const knownDevices = [
    {
        id: 'temperatur_data_1',
        name: 'Temperature Sensor',
        modeEntity: 'sensor.temperature_sensor_state',
        sensors: ['sensor.mqtt_humidity', 'sensor.mqtt_temperature', 'sensor.mqtt_pressure'],
    },
    // { TODO: Add camera
    //     id: "camera_stream_1",
    //     name: "Camera Stream",
    //     modeEntity: "sensor.temperature_sensor_state",
    // },
]

/**
 *
 */
const mapDevices = (entities: HassEntity[]) => {
    const discoveredDevices: any[] = []

    knownDevices.forEach((knownDevice) => {
        const deviceModeEntity = entities.find(
            (entity) => entity.entity_id === knownDevice.modeEntity,
        )
        if (!deviceModeEntity) {
            // ignore device without mode entity
            return
        }

        // Get mode
        // Get device mode as Integer
        const mode = parseInt(deviceModeEntity.state)

        // Find all sensors related to current device
        const devices = entities.filter((entity) => {
            return knownDevice.sensors.find((sensor) => sensor === entity.entity_id)
        })

        // No devices available
        if (devices.length === 0) {
            return
        }

        // Map mode to device(s)
        discoveredDevices.push({ id: knownDevice.id, name: knownDevice.name, mode, devices })
    })
    console.log(discoveredDevices)
    return discoveredDevices
}

const mapDeviceList = (states: HassEntity[]) => {
    const discoveredDevices = mapDevices(states)
    if (!discoveredDevices) {
        return
    }
    // TODO: remove fake camera
    // discoveredDevices.push( dummyCameraKnownDevice );

    return discoveredDevices.map((device) => {
        return { id: device.id, mode: device.mode, name: device.name }
    })
}

export = mapDeviceList
