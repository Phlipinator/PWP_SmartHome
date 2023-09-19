import useFetch from './useFetch'
import { middlewareURL } from '../environmentVariables'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeviceData } from '../components/pages/devicecontrol/DeviceOverview'
import * as connModes from '../constants/ConnectionModes'
import { ConnectionMode } from '../constants/ConnectionModes'
import {
  knownCameraIDs,
  knownThermostatIDs,
} from '../components/ui-elements/DevicesOverviewElements'

/**
 * hook that handles all shared functionalities of devices
 * @param deviceID the ID of the device you want to get information about
 */

const useDeviceControl = (deviceID: string) => {
  // get and delete requests to our backend
  const { getRequest, postRequest, deleteRequest } = useFetch()

  // all device information
  const [deviceName, setDeviceName] = useState<string>('')
  const [deviceIcon, setDeviceIcon] = useState<string>('')
  const [deviceType, setDeviceType] = useState<string>('')
  const [deviceData, setDeviceData] = useState<any>()
  const [deviceStatus, setDeviceStatus] = useState<ConnectionMode>(connModes.OFFLINE)

  // Is the data still loading from the backend?
  const [isComponentLoading, setComponentLoading] = useState(true) // TODO: set back to true

  // Navigation hook
  const navigate = useNavigate()

  // Update data after receiving token and this device's ID
  useEffect(() => {
    if (deviceID != '') {
      initializeDeviceData()
      // initializeDeviceInformation()
    }
  }, [deviceID])

  // // handle all data that is received through the getUserDevices endpoint
  // const initializeDeviceInformation = () => {
  //   try {
  //     getRequest(`${middlewareURL}/api/getUserDevices?userID=`).then((data) => {
  //       const currentDevice = data.devices?.filter((device: DeviceData) => {
  //         return device.deviceId == deviceID
  //       })[0]
  //
  //       setDeviceName(currentDevice.name)
  //
  //       setDeviceType(currentDevice.deviceType)
  //
  //       switch (currentDevice.deviceType) {
  //         case 'THERMOSTAT':
  //           setDeviceIcon('ic_flame.svg')
  //           break
  //         case 'CAMERA':
  //           setDeviceIcon('ic_eye.svg')
  //           break
  //       }
  //
  //       // setDeviceStatus(connModes.ONLINE)
  //       //
  //       // TODO: uncomment below code when retrieving connection mode works, and remove above line
  //       console.log(`------STATUS: ${currentDevice.status}`)
  //       switch (currentDevice.status) {
  //         case 'ONLINE':
  //           setDeviceStatus(connModes.ONLINE)
  //           break
  //         // case "LOCAL": deviceStatus = connModes.LOCAL_NETWORK; break;
  //         default:
  //           setDeviceStatus(connModes.OFFLINE)
  //           break
  //       }
  //     })
  //   } catch (err) {
  //     setComponentLoading(false)
  //     console.log(err)
  //   }
  // }

  // handle all data that is received through the getDataDevice endpoint
  const initializeDeviceData = () => {
    try {
      if (deviceID) {
        if (knownThermostatIDs.includes(deviceID)) {
          getRequest(`${middlewareURL}/devices/thermostat/details?deviceId=${deviceID}`).then(
            (data) => {
              console.log('DEVICE DATA: ')
              console.log(data)
              switch (data.mode) {
                case 3:
                  setDeviceStatus(connModes.ONLINE)
                  break
                case 2:
                  setDeviceStatus(connModes.LOCAL_NETWORK)
                  break
                default:
                  setDeviceStatus(connModes.OFFLINE)
                  break
              }
              setDeviceData(data)
              setComponentLoading(false)
            },
          )
        } else if (knownCameraIDs.includes(deviceID)) {
          getRequest(`${middlewareURL}/devices/camera/details?deviceId=${deviceID}`).then(
            (data) => {
              console.log('DEVICE DATA: ')
              console.log(data)
              switch (data.mode) {
                case 3:
                  setDeviceStatus(connModes.ONLINE)
                  break
                case 2:
                  setDeviceStatus(connModes.LOCAL_NETWORK)
                  break
                default:
                  setDeviceStatus(connModes.OFFLINE)
                  break
              }
              setDeviceData(data)
              setComponentLoading(false)
            },
          )
        } else {
          console.error('Device type not known.')
          setComponentLoading(false)
        }
        // getRequest(`${middlewareURL}/h-a/deviceInfo?deviceId=${deviceID}`).then((data) => {
        //   console.log('DEVICE DATA: ')
        //   console.log(data)
        //   switch (data.mode) {
        //     case 3:
        //       setDeviceStatus(connModes.ONLINE)
        //       break
        //     case 2:
        //       setDeviceStatus(connModes.LOCAL_NETWORK)
        //       break
        //     default:
        //       setDeviceStatus(connModes.OFFLINE)
        //       break
        //   }
        //   setDeviceData(data)
        //   setComponentLoading(false)
        // })
      } else {
        console.error('No deviceID specified.')
        setComponentLoading(false)
      }
    } catch (err) {
      console.error(err)
      setComponentLoading(false)
    }
  }

  // changes connection mode
  const setConnectionMode = (connectionMode: ConnectionMode) => {
    postRequest(
      `${middlewareURL}/devices/setConnectionMode?deviceId=${deviceID}`,
      JSON.stringify({ connectionMode: connectionMode.id }),
    ).then(() => {
      switch (connectionMode) {
        case connModes.ONLINE:
          setDeviceStatus(connModes.ONLINE)
          break
        case connModes.LOCAL_NETWORK:
          setDeviceStatus(connModes.LOCAL_NETWORK)
          break
        default:
          setDeviceStatus(connModes.OFFLINE)
          break
      }
    })
  }

  // Request to remove the device from the user's account
  const removeDevice = (): void => {
    console.log('DELETING NETWORK...')
    try {
      deleteRequest(`${middlewareURL}/api/removeNetwork`).then(() => navigate(-1))
    } catch (err) {
      console.error(err)
    }
  }

  return {
    isComponentLoading,
    removeDevice,
    setConnectionMode,
    deviceID,
    deviceData,
    deviceName,
    deviceStatus,
    deviceIcon,
    deviceType,
  }
}
export default useDeviceControl
