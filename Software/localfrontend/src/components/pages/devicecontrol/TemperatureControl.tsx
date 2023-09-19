import React, { ReactElement, useEffect, useRef, useState } from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { middlewareURL } from '../../../environmentVariables'
import useFetch from '../../../hooks/useFetch'
import useDeviceControl from '../../../hooks/useDeviceControl'
import { DeviceControl } from './DeviceControl'
import { useSearchParams } from 'react-router-dom'
import { ConnectionMode, ONLINE } from '../../../constants/ConnectionModes'
import * as connModes from '../../../constants/ConnectionModes'

interface TempDataItem {
  state: string
  mode: number
  timestamp: string
  unit_of_measurement: string
  name: string
}

interface TempData {
  id: string
  name: string
  mode: 0
  deviceData: TempDataItem[]
}

// const historyDummyData = [
//   { x: '8:00', yVal: -8 },
//   { x: '9:00', yVal: 13 },
//   { x: '10:00', yVal: 16 },
//   { x: '11:00', yVal: 15 },
//   { x: '12:00', yVal: 18 },
// ]

const TemperatureControl = (): ReactElement => {
  const [search] = useSearchParams()
  const { deviceID, deviceData } = useDeviceControl(search.get('deviceID') || '')

  const [uomTemp, setUomTemp] = useState('°C')
  const [currentTempRead, setCurrentTempRead] = useState('0')

  const [uomHumidity, setUomHumidity] = useState('%')
  const [currentHumidityRead, setCurrentHumidityRead] = useState('0')

  const [uomPressure, setUomPressure] = useState('hPa')
  const [currentPressureRead, setCurrentPressureRead] = useState('0')

  const { postRequest } = useFetch()

  useEffect(() => {
    if (deviceData) {
      if (deviceData.mode >= 2) {
        updateData(deviceData)
      }
    }
  }, [deviceData])

  const updateData = (data: any): void => {
    setCurrentTempRead(data.data.temperature.value)
    setUomTemp(data.data.temperature.unit)
    setCurrentHumidityRead(data.data.humidity.value)
    setUomHumidity(data.data.humidity.unit)
    setCurrentPressureRead(data.data.pressure.value)
    setUomPressure(data.data.pressure.unit)
  }

  return (
    <DeviceControl deviceName='Temperature Sensor'>
      <Accordion allowMultiple defaultIndex={[]} mt={4}>
        <AccordionItem bgColor='customBackground.card' border='unset' borderRadius={6} mb={4}>
          <h2>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='left'>
                <Text fontSize='xl' fontWeight='semibold' m={0}>
                  Temperature
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <VStack>
              <Text textAlign='left' fontSize='3xl'>
                {currentTempRead} {uomTemp}
              </Text>
            </VStack>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem bgColor='customBackground.card' border='unset' borderRadius={6} mb={4}>
          <h2>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='left'>
                <Text fontSize='xl' fontWeight='semibold' m={0}>
                  Humidity
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <VStack>
              <Text textAlign='left' fontSize='3xl'>
                {currentHumidityRead} {uomHumidity}
              </Text>
            </VStack>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem bgColor='customBackground.card' border='unset' borderRadius={6} mb={4}>
          <h2>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='left'>
                <Text fontSize='xl' fontWeight='semibold' m={0}>
                  Pressure
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <VStack>
              <Text textAlign='left' fontSize='3xl'>
                {currentPressureRead} {uomPressure}
              </Text>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </DeviceControl>
  )
}

export { TemperatureControl }
