import React from 'react'
import { Flex, Image, Spacer, Text, VStack } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { DeviceStatus } from '../pages/devicecontrol/DeviceStatusElement'
import useDeviceControl from '../../hooks/useDeviceControl'
import { DeviceData } from '../pages/devicecontrol/DeviceOverview'
import * as connModes from '../../constants/ConnectionModes'

// Props of DocOverviewList
interface DevicesOverviewListProps {
  deviceIDs: Array<DeviceData>
}

export const knownThermostatIDs = ['67890']
export const knownCameraIDs = ['12345']

// Displays the Data given in the props as a list of clickable cards
const DevicesOverviewList: React.FC<DevicesOverviewListProps> = (props) => {
  return (
    <VStack spacing={4}>
      {props.deviceIDs.map((device, index) => (
        <DevicesOverviewItem key={index} device={device} />
      ))}
    </VStack>
  )
}

// Props of DocOverviewItem
interface DevicesOverviewItemProps {
  device: DeviceData
}

// Displays the given data as a clickable card
const DevicesOverviewItem: React.FC<DevicesOverviewItemProps> = (props) => {
  const navigate = useNavigate()
  console.log('Device: ')
  console.log(props.device)

  let deviceIcon = ''
  if (knownThermostatIDs.includes(props.device.id)) {
    deviceIcon = 'ic_flame.svg'
  } else if (knownCameraIDs.includes(props.device.id)) {
    deviceIcon = 'ic_eye.svg'
  }

  const deviceStatus =
    props.device.mode == 2
      ? connModes.LOCAL_NETWORK
      : props.device.mode == 3
      ? connModes.ONLINE
      : connModes.OFFLINE
  // const { deviceName, deviceStatus, deviceIcon, deviceType } = useDeviceControl(props.deviceId)

  // Navigate to the control page of the selected device
  const navigateToDevicePage = (): void => {
    if (knownThermostatIDs.includes(props.device.id)) {
      navigate(`/devices/thermostat?deviceID=${props.device.id}`)
    } else if (knownCameraIDs.includes(props.device.id)) {
      navigate(`/devices/camera?deviceID=${props.device.id}`)
    } else {
      console.error('Device type not known.')
    }
  }

  return (
    <Flex
      w='100%'
      // h={20}
      p={4}
      boxSizing='border-box'
      flexDirection='column'
      borderRadius={4}
      bgColor='customBackground.card'
      _hover={{ bgColor: 'customBackground.cardHover' }}
      cursor='pointer'
      onClick={navigateToDevicePage}
    >
      <Flex alignItems='center' mb={4} w='100%' h={12}>
        <Image src={process.env.PUBLIC_URL + '/assets/images/' + deviceIcon} height='100%' mr={4} />
        <Text fontSize='xl' fontWeight='semibold'>
          {props.device.name}
        </Text>
        <Spacer />
        <ChevronRightIcon h='custom.arrowIcon' w='custom.arrowIcon' mr={-2} />
      </Flex>
      <DeviceStatus status={deviceStatus} isClickable={false} />
    </Flex>
  )
}

export { DevicesOverviewList }
export type { DevicesOverviewItemProps }
