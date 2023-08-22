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
import { HistoryChart, HistoryChartDataPoint } from '../../ui-elements/HistoryChartElement'
import { backendURL } from '../../../environmentVariables'
import useFetch from '../../../hooks/useFetch'
import useDeviceControl from '../../../hooks/useDeviceControl'
import { DeviceControl } from './DeviceControl'
import { useSearchParams } from 'react-router-dom'
import { ONLINE } from '../../../constants/ConnectionModes'

interface TempData {
  // 'device-id': string
  'temperature-history': number[]
  'humidity-history': number[]
  'pressure-history': number[]
  'timestamp-history': string[]
  uomTemp: string
  uomHum: string
  uomPress: string
  status: string
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
  const [historyTempData, setHistoryTempData] = useState<HistoryChartDataPoint[]>([])

  const [uomHumidity, setUomHumidity] = useState('%')
  const [currentHumidityRead, setCurrentHumidityRead] = useState('0')
  const [historyHumidityData, setHistoryHumidityData] = useState<HistoryChartDataPoint[]>([])

  const [uomPressure, setUomPressure] = useState('hPa')
  const [currentPressureRead, setCurrentPressureRead] = useState('0')
  const [historyPressureData, setHistoryPressureData] = useState<HistoryChartDataPoint[]>([])

  const { postRequest } = useFetch()

  useEffect(() => {
    if (deviceData) {
      console.log(`USE EFFECT DEVICE DATA:`)
      console.log(deviceData)
      if (deviceData['status'] == 'ONLINE') {
        updateData(deviceData)
      }
    }
  }, [deviceData])

  const updateData = (data: TempData): void => {
    if (data['temperature-history'][0]) {
      setCurrentTempRead(data['temperature-history'][0].toFixed(2).toString())
      setUomTemp(data.uomTemp)
    } else {
      setCurrentTempRead('?')
      setUomTemp('')
    }
    if (data['humidity-history'][0]) {
      setCurrentHumidityRead(data['humidity-history'][0].toFixed(2).toString())
      setUomHumidity(data.uomHum)
    } else {
      setCurrentHumidityRead('?')
      setUomHumidity('')
    }
    if (data['pressure-history'][0]) {
      setCurrentPressureRead(data['pressure-history'][0].toFixed(2).toString())
      setUomPressure(data.uomPress)
    } else {
      setCurrentPressureRead('?')
      setUomPressure('')
    }
    const currentTempHistory: HistoryChartDataPoint[] = []
    const currentHumidityHistory: HistoryChartDataPoint[] = []
    const currentPressureHistory: HistoryChartDataPoint[] = []

    const historyLength = data['timestamp-history'].length
    for (let i = 0; i < historyLength; i++) {
      const timeData = data['timestamp-history'][i]
      const tempData = data['temperature-history'][i]
      const humidityData = data['humidity-history'][i]
      const pressureData = data['pressure-history'][i]

      if (timeData) {
        const timeString = new Date(parseInt(timeData))
        const hourString = ('00' + timeString.getHours()).slice(-2)
        const minuteString = ('00' + timeString.getMinutes()).slice(-2)
        if (tempData && tempData != -9999) {
          currentTempHistory.push({
            x: `${hourString}:${minuteString}`,
            yVal: tempData,
          })
        }
        if (humidityData && humidityData != -9999) {
          currentHumidityHistory.push({
            x: `${hourString}:${minuteString}`,
            yVal: humidityData,
          })
        }
        if (pressureData && pressureData != -9999) {
          currentPressureHistory.push({
            x: `${hourString}:${minuteString}`,
            yVal: pressureData,
          })
        }
      }
    }
    setHistoryTempData(currentTempHistory.reverse())
    setHistoryHumidityData(currentHumidityHistory.reverse())
    setHistoryPressureData(currentPressureHistory.reverse())
  }

  return (
    <DeviceControl>
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
              <VStack w='100%' pt={4}>
                <Text textAlign='left' fontWeight='semibold'>
                  History:
                </Text>
                <HistoryChart
                  data={historyTempData}
                  xLabel='Time'
                  yLabel='Temperature'
                  colorHex='#fb7d3c'
                />
              </VStack>
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
              <VStack w='100%' pt={4}>
                <Text textAlign='left' fontWeight='semibold'>
                  History:
                </Text>
                <HistoryChart
                  data={historyHumidityData}
                  xLabel='Time'
                  yLabel='Temperature'
                  colorHex='#4abae9'
                />
              </VStack>
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
              <VStack w='100%' pt={4}>
                <Text textAlign='left' fontWeight='semibold'>
                  History:
                </Text>
                <HistoryChart
                  data={historyPressureData}
                  xLabel='Time'
                  yLabel='Temperature'
                  colorHex='#79eb79'
                />
              </VStack>
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </DeviceControl>
  )
}

export { TemperatureControl }
