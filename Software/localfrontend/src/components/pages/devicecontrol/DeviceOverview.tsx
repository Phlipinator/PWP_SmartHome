import React, { ReactElement, useEffect, useState } from 'react'
import Page from '../../Page'
import { DevicesOverviewList } from '../../ui-elements/DevicesOverviewElements'
import { Button, Spinner, Text, useDisclosure } from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { middlewareURL } from '../../../environmentVariables'
import useFetch from '../../../hooks/useFetch'

interface DeviceData {
  id: string
  name: string
  mode: number
}

// Component for listing the devices the logged-in user added to his account
const DeviceOverview = (): ReactElement => {
  const [isComponentLoading, setComponentLoading] = useState(true)
  const [devices, setDevices] = useState<DeviceData[]>([])
  const navigate = useNavigate()
  const { getRequest, deleteRequest } = useFetch()

  // Update the device list after the component is mounted
  useEffect(() => {
    loadDeviceList()
  }, [])

  // Load the device list of the logged-in user from the backend
  const loadDeviceList = (): void => {
    try {
      getRequest(`${middlewareURL}/devices`).then((data) => {
        const deviceIDs = new Array<string>()
        console.log('DATA: ')
        console.log(data)
        // data.devices?.forEach((device: DeviceData) => {
        //   deviceIDs.push(device.deviceId)
        // })
        if (!data.devices) {
          setDevices([])
        } else {
          setDevices(data.devices)
        }
        setComponentLoading(false)
      })
    } catch (err) {
      console.error(err)
      setComponentLoading(false)
    }
  }

  return (
    <Page headerName='Your Devices' hasBackButton={false} backButtonDestination='/'>
      {isComponentLoading ? (
        <Spinner />
      ) : (
        <div className='DocumentationOverview'>
          <DevicesOverviewList deviceIDs={devices} />
          {devices.length == 0 ? (
            <Text>
              There are no devices in your local network or the middleware is not running.
            </Text>
          ) : (
            ''
          )}
        </div>
      )}
    </Page>
  )
}

export { DeviceOverview }
export type { DeviceData }
