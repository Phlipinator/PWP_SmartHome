import React, { useEffect, useState } from 'react'
import { Flex, HStack, Image, Spacer, Text, useDisclosure } from '@chakra-ui/react'
import { ConnectionModeOverlay } from './ConnectionModeOverlay'
import { ConnectionMode } from '../../../constants/ConnectionModes'
import * as connModes from '../../../constants/ConnectionModes'

interface DeviceStatusProps {
  status: ConnectionMode
  isClickable: boolean
  setConnectionMode?: (connectionMode: ConnectionMode) => void
}

const DeviceStatus: React.FC<DeviceStatusProps> = (props) => {
  const [background, setBackground] = useState<string>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Update the color of the status background
  useEffect(() => {
    if (props.status == connModes.ONLINE) {
      setBackground(connModes.ONLINE.color)
    } else if (props.status == connModes.LOCAL_NETWORK) {
      setBackground(connModes.LOCAL_NETWORK.color)
    } else if (props.status == connModes.OFFLINE) {
      setBackground(connModes.OFFLINE.color)
    }
  }, [props.status])

  return (
    <>
      <Flex
        alignItems='center'
        onClick={
          props.isClickable &&
          (props.status == connModes.ONLINE || props.status == connModes.LOCAL_NETWORK)
            ? onOpen
            : undefined
        }
        cursor={!isOpen ? 'pointer' : 'default'}
      >
        <Text fontSize='lg' fontWeight='semibold' m={0}>
          {props.status == connModes.ONLINE ? 'Connection Mode' : 'Device Status'}
        </Text>
        <Spacer />
        <HStack backgroundColor={background} borderRadius={100} px={4} py={2} m={0} h='35px'>
          <Image src={props.status.imageSource} h='100%'></Image>
          <Text fontSize='l' fontWeight='semibold'>
            {props.status?.name}
          </Text>
        </HStack>
      </Flex>
      <ConnectionModeOverlay
        isOpen={isOpen}
        onClose={onClose}
        currentStatus={props.status}
        setConnectionMode={props.setConnectionMode}
      />
    </>
  )
}

export { DeviceStatus }
