import React, { ReactElement, useEffect, useState } from 'react'
import Page from '../../Page'
import { DevicesOverviewList } from '../../ui-elements/DevicesOverviewElements'
import { Button, Spinner, useDisclosure } from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { backendURL } from '../../../environmentVariables'
import useAuthentication from '../../../hooks/useAuthentication'
import useFetch from '../../../hooks/useFetch'
import { Alert } from '../../ui-elements/Alert'

interface DeviceData {
  deviceId: string
  name: string
  deviceType: string
  mode: string
}

// Component for listing the devices the logged-in user added to his account
const DeviceOverview = (): ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isComponentLoading, setComponentLoading] = useState(true)
  const { token, user } = useAuthentication()
  const [devices, setDevices] = useState<DeviceData[]>([])
  const navigate = useNavigate()
  const { getRequest, deleteRequest } = useFetch(setComponentLoading)

  // Update the device list after receiving Auth0 token
  useEffect(() => {
    if (token != '') {
      loadDeviceList()
    }
  }, [token])

  // Load the device list of the logged-in user from the backend
  const loadDeviceList = (): void => {
    try {
      if (typeof user != 'undefined' && typeof user.email != 'undefined') {
        getRequest(`${backendURL}/api/getUserDevices?userID=${user.email}`).then((data) => {
          const deviceIDs = new Array<string>()
          // console.log('DATA: ')
          // console.log(data)
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
      }
    } catch (err) {
      setComponentLoading(false)
      console.error(err)
    }
  }

  // Request to remove the device from the user's account
  const removeNetwork = (): void => {
    console.log('DELETING NETWORK...')
    try {
      deleteRequest(`${backendURL}/api/removeNetwork`).then(() => window.location.reload())
    } catch (err) {
      setComponentLoading(false)
      console.error(err)
    }
  }

  return (
    <Page headerName='Your Devices' hasBackButton={true} backButtonDestination='/'>
      {isComponentLoading ? (
        <Spinner />
      ) : (
        <div className='DocumentationOverview'>
          <DevicesOverviewList deviceIDs={devices} />
          {devices.length == 0 ? (
            <Button
              mt={4}
              colorScheme='telegram'
              border='none'
              onClick={() => {
                navigate('/add')
              }}
            >
              <AddIcon mr={2} /> Add Hub
            </Button>
          ) : (
            <Button
              mt={4}
              colorScheme='red'
              variant='outline'
              w='100%'
              cursor='pointer'
              onClick={onOpen}
            >
              <DeleteIcon mr={2} /> Disconnect Hub
            </Button>
          )}

          <Alert
            isOpen={isOpen}
            onClose={onClose}
            onClick={removeNetwork}
            headerText='Disconnect Hub'
            bodyText='Do you want to remove the hub from your account?'
            confirmButtonText='Remove'
          />
        </div>
      )}
    </Page>
  )
}

export { DeviceOverview }
export type { DeviceData }
