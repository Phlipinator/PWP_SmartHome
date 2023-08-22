import React, { useRef } from 'react'
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  HStack,
  Box,
  Text,
  Image,
  useDisclosure,
} from '@chakra-ui/react'

import * as connModes from '../../../constants/ConnectionModes'
import { ConnectionMode } from '../../../constants/ConnectionModes'
import { Alert } from '../../ui-elements/Alert'

interface ConnectionModeItemProps {
  imageSource: string
  connectionMode: ConnectionMode // this item's connection mode
  currentlySelectedMode: ConnectionMode // the current selected mode
  setConnectionMode?: (connectionMode: ConnectionMode) => void
  color: string
  closeOverlay?: () => void
}
const ConnectionModeItem: React.FC<ConnectionModeItemProps> = ({
  currentlySelectedMode,
  imageSource,
  connectionMode,
  color,
  closeOverlay,
  setConnectionMode,
}: ConnectionModeItemProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const getIconFilter = () => {
    switch (connectionMode) {
      case connModes.ONLINE:
        return 'brightness(0) saturate(100%) invert(52%) sepia(15%) saturate(1696%) hue-rotate(97deg) brightness(94%) contrast(83%)'
      case connModes.AP_MODE:
        return 'brightness(0) saturate(100%) invert(97%) sepia(26%) saturate(2884%) hue-rotate(311deg) brightness(104%) contrast(100%)'
      case connModes.LOCAL_NETWORK:
        return 'brightness(0) saturate(100%) invert(35%) sepia(25%) saturate(3430%) hue-rotate(203deg) brightness(102%) contrast(85%)'
      case connModes.OFFLINE:
        return 'brightness(0) saturate(100%) invert(49%) sepia(10%) saturate(3747%) hue-rotate(314deg) brightness(100%) contrast(110%)'
    }
  }
  return (
    <>
      <HStack
        padding={2}
        marginLeft={-2}
        marginRight={-2}
        spacing={4}
        cursor='pointer'
        backgroundColor={currentlySelectedMode == connectionMode ? 'customBackground.main' : ''}
        style={{
          boxShadow: currentlySelectedMode == connectionMode ? '0 0 0 2pt ' + color : 'none',
          borderRadius: '5px',
        }}
      >
        <Image src={imageSource} w='40px' filter={getIconFilter()}></Image>
        <Box
          onClick={() => {
            if (connectionMode != currentlySelectedMode) {
              onOpen()
            }
          }}
        >
          <Box
            justifyContent='start'
            fontWeight='bold'
            color={currentlySelectedMode == connectionMode ? connectionMode.color : ''}
          >
            {connectionMode.name}
          </Box>
          <Box justifyContent='start'> {connectionMode.shortDescription} </Box>
        </Box>
      </HStack>
      <Alert
        isOpen={isOpen}
        onClose={onClose}
        onClick={() => {
          if (setConnectionMode) {
            setConnectionMode(connectionMode)
          }
          if (closeOverlay) {
            closeOverlay()
          }
          onClose()
        }}
        headerText='Switch Connection Mode'
        bodyText={`Are you sure you want to switch to ${connectionMode.name} Mode?`}
        confirmButtonText="Yes, I'm sure"
      />
    </>
  )
}

interface ConnectionModeOverlayProps {
  isOpen: boolean
  onClose: () => void
  currentStatus: ConnectionMode
  setConnectionMode?: (connectionMode: ConnectionMode) => void
}

const ConnectionModeOverlay: React.FC<ConnectionModeOverlayProps> = ({
  isOpen,
  onClose,
  currentStatus,
  setConnectionMode,
}: ConnectionModeOverlayProps) => {
  return (
    <>
      <Drawer placement='bottom' onClose={onClose} isOpen={isOpen} size='sm'>
        <DrawerOverlay />
        <DrawerContent
          backgroundColor='customBackground.card'
          style={{ maxWidth: '100% !important', left: '', right: '' }}
        >
          <DrawerHeader borderBottomWidth='1px'>
            <Text fontSize='md' fontWeight='bold'>
              Change Connection Mode
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <ConnectionModeItem
              imageSource={connModes.OFFLINE.imageSource}
              connectionMode={connModes.OFFLINE}
              currentlySelectedMode={currentStatus}
              color={connModes.OFFLINE.color}
              setConnectionMode={setConnectionMode}
              closeOverlay={onClose}
            />
            <ConnectionModeItem
              imageSource={connModes.AP_MODE.imageSource}
              connectionMode={connModes.AP_MODE}
              color={connModes.AP_MODE.color}
              currentlySelectedMode={currentStatus}
              setConnectionMode={setConnectionMode}
              closeOverlay={onClose}
            />
            <ConnectionModeItem
              imageSource={connModes.LOCAL_NETWORK.imageSource}
              connectionMode={connModes.LOCAL_NETWORK}
              color={connModes.LOCAL_NETWORK.color}
              currentlySelectedMode={currentStatus}
              setConnectionMode={setConnectionMode}
              closeOverlay={onClose}
            />
            <ConnectionModeItem
              imageSource={connModes.ONLINE.imageSource}
              connectionMode={connModes.ONLINE}
              color={connModes.ONLINE.color}
              currentlySelectedMode={currentStatus}
              setConnectionMode={setConnectionMode}
              closeOverlay={onClose}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export { ConnectionModeOverlay }
