import React, { ReactElement, useEffect } from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from '@chakra-ui/react'
import { HistoryChart, HistoryChartDataPoint } from '../../ui-elements/HistoryChartElement'
import { backendURL } from '../../../environmentVariables'
import useAuthentication from '../../../hooks/useAuthentication'
import useDeviceControl from '../../../hooks/useDeviceControl'
import { DeviceControl } from './DeviceControl'
import useFetch from '../../../hooks/useFetch'
import { useSearchParams } from 'react-router-dom'

interface CameraData {
  'device-id': string
  // TODO: edit according to backend structure
}

const CameraControl = (): ReactElement => {
  const [search, setSearch] = useSearchParams()
  const { deviceData, isComponentLoading, deviceName, deviceStatus, setConnectionMode } =
    useDeviceControl(search.get('deviceID') || '')

  // const { token, user } = useAuthentication()
  //
  // const { postRequest } = useFetch()

  useEffect(() => {
    if (deviceData) {
      updateCameraData(deviceData)
    }
  }, [deviceData])

  const updateCameraData = (data: CameraData): void => {
    console.log(data)
  }

  return (
    <DeviceControl
      isComponentLoading={isComponentLoading}
      deviceName={deviceName}
      deviceStatus={deviceStatus}
      setConnectionMode={setConnectionMode}
    >
      <Accordion allowMultiple defaultIndex={[0]} mt={4}>
        <AccordionItem bgColor='customBackground.card' border='unset' borderRadius={6} mb={4}>
          <h2>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='left'>
                <Text fontSize='xl' fontWeight='semibold' m={0}>
                  Camera Feed
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <iframe
              width='100%'
              height='auto'
              src={deviceData ? deviceData.streamURL : ''}
              title='Camera Live Stream'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen
            ></iframe>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </DeviceControl>
  )
}

export { CameraControl }
