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
import { middlewareURL } from '../../../environmentVariables'
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
  const { deviceData } = useDeviceControl(search.get('deviceID') || '')

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

  const updateHeight = (event: any) => {
    const iFrame = event.target as HTMLIFrameElement
    // 16:9 aspect ratio
    iFrame.height = iFrame.scrollWidth * 0.5625 + 'px'
  }

  return (
    <DeviceControl deviceName='Camera'>
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
              src={deviceData ? deviceData.data.streamUrl : ''}
              onLoad={(e) => updateHeight(e)}
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
