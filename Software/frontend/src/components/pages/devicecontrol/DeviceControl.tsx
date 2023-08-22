import { Button, Spinner, Text, useDisclosure } from '@chakra-ui/react'
import React, { ReactNode, useRef, useState } from 'react'
import Page from '../../Page'
import { DeviceStatus } from './DeviceStatusElement'
import * as connModes from '../../../constants/ConnectionModes'
import { HistoryChart } from '../../ui-elements/HistoryChartElement'
import { DeleteIcon } from '@chakra-ui/icons'
import useDeviceControl from '../../../hooks/useDeviceControl'
import { useSearchParams } from 'react-router-dom'
import { Alert } from '../../ui-elements/Alert'
import { ConnectionMode } from '../../../constants/ConnectionModes'

interface DeviceControlProps {
  children: ReactNode
  isComponentLoading: boolean
  deviceName: string
  deviceStatus: ConnectionMode
  setConnectionMode: (connectionMode: ConnectionMode) => void
}
const DeviceControl: React.FC<DeviceControlProps> = ({
  children,
  isComponentLoading,
  deviceName,
  deviceStatus,
  setConnectionMode,
}: DeviceControlProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [search, setSearch] = useSearchParams()
  // const { isComponentLoading, deviceName, deviceStatus, setConnectionMode } = useDeviceControl(
  //   search.get('deviceID') || '',
  // )

  return (
    <Page headerName={deviceName} hasBackButton={true} backButtonDestination='/devices'>
      {isComponentLoading ? (
        <Spinner />
      ) : (
        <div className='ThermostatControl'>
          <DeviceStatus
            status={deviceStatus}
            isClickable={true}
            setConnectionMode={setConnectionMode}
          />

          {deviceStatus == connModes.OFFLINE ? (
            <div className='StatusOffline'>
              <Text align='left' pt={4}>
                Your device can currently not be reached by our server. Check your device and make
                sure the ID is correct, it is in online-mode and has an internet connection.
              </Text>
            </div>
          ) : (
            <div className='StatusOnline'>{children}</div>
          )}
        </div>
      )}
    </Page>
  )

  // { deviceStatus == connModes.OFFLINE ? (
  //   <Button
  //     mt={4}
  //     colorScheme='red'
  //     variant='outline'
  //     w='100%'
  //     cursor='pointer'
  //     onClick={onOpen}
  //   >
  //     <DeleteIcon mr={2} /> Remove device
  //   </Button>
  // ) : (
  //   []
  // )}
  //
  // <Alert
  //   isOpen={isOpen}
  //   onClose={onClose}
  //   onClick={removeDevice}
  //   headerText='Remove Device'
  //   bodyText='Do you want to remove this device from your account?'
  //   confirmButtonText='Remove'
  // />
}

export { DeviceControl }
