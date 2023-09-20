import React, { ReactElement, useEffect } from 'react'
import IframeResizer from 'iframe-resizer-react'
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
import DynamicIFrame from '../../ui-elements/DynamicIFrame'

interface CameraData {
  'device-id': string
  // TODO: edit according to backend structure
}

const CameraControl = (): ReactElement => {
  const [search, setSearch] = useSearchParams()
  const { deviceData, isComponentLoading, deviceName, deviceStatus, setConnectionMode } =
    useDeviceControl(search.get('deviceID') || '')

  useEffect(() => {
    if (deviceData) {
      updateCameraData(deviceData)
    }
  }, [deviceData])

  const updateCameraData = (data: CameraData): void => {
    console.log(data)
  }

  const updateHeight = (event: any) => {
    const iFrame = event.target as HTMLIFrameElement
    // 16:9 aspect ratio
    iFrame.height = iFrame.scrollWidth * 0.5625 + 'px'
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
              style={{ width: '1px', minWidth: '100%' }}
              src={deviceData ? deviceData['stream-url'] : ''}
              onLoad={(e) => updateHeight(e)}
              title='Camera Live Stream'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </DeviceControl>
  )
}
// <DynamicIFrame src={deviceData ? deviceData['stream-url'] : ''} />
// ;<iframe
//   width='100%'
//   height='auto'
//   src={deviceData ? deviceData['stream-url'] : ''}
//   title='Camera Live Stream'
//   allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
//   allowFullScreen
// ></iframe>
export { CameraControl }
