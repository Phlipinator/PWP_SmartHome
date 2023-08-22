import { Image, Box, StackDivider, Stack, HStack, ListItem, UnorderedList } from '@chakra-ui/react'
import { DeviceDocumentationPage } from './DeviceDocumentationPage'

const CameraDocumentation = () => {
  const featuresList = (
    <Stack divider={<StackDivider />} spacing='4'>
      <HStack pt={1}>
        <Box width='20%'>
          <Image src='/assets/images/wifi-off.png' width='100%' padding={2}></Image>
        </Box>
        <Box width='100%'>
          <UnorderedList fontSize='sm' textAlign='left' width='100%'>
            <ListItem>See camera status on the device</ListItem>
          </UnorderedList>
        </Box>
      </HStack>
      <HStack pt={1}>
        <Box width='20%'>
          <Image src='/assets/images/ap.png' width='100%' padding={2}></Image>
        </Box>

        <Box width='100%'>
          <UnorderedList fontSize='sm' textAlign='left' width='100%'>
            <ListItem>See current camera status in the user interface</ListItem>
          </UnorderedList>
        </Box>
      </HStack>
      <HStack pt={1}>
        <Box width='20%'>
          <Image src='/assets/images/wifi.png' width='100%' padding={2}></Image>
        </Box>
        <Box width='100%'>
          <UnorderedList fontSize='sm' textAlign='left' width='100%'>
            <ListItem>See current camera feed</ListItem>
            <ListItem>Overview of all devices in the network</ListItem>
          </UnorderedList>
        </Box>
      </HStack>
      <HStack pt={1}>
        <Box width='20%'>
          <Image src='/assets/images/online.png' width='100%' padding={2}></Image>
        </Box>
        <Box width='100%'>
          <UnorderedList fontSize='sm' textAlign='left' width='100%'>
            <ListItem>See current camera feed</ListItem>
            <ListItem>Online access to all your devices in the hub</ListItem>
          </UnorderedList>
        </Box>
      </HStack>
    </Stack>
  )

  const securityList = (
    <Stack divider={<StackDivider />} spacing='4'>
      <HStack pt={1}>
        <Box width='20%'>
          <Image src='/assets/images/wifi-off.png' width='100%' padding={2}></Image>
        </Box>
        <Box width='100%' fontSize='sm' textAlign='left'>
          None
        </Box>
      </HStack>
      <HStack pt={1}>
        <Box width='20%'>
          <Image src='/assets/images/ap.png' width='100%' padding={2}></Image>
        </Box>

        <Box width='100%' fontSize='sm' textAlign='left'>
          Anyone in the proximity of the device can connect to it and gains access to the device
        </Box>
      </HStack>
      <HStack pt={1}>
        <Box width='20%'>
          <Image src='/assets/images/wifi.png' width='100%' padding={2}></Image>
        </Box>
        <Box width='100%' fontSize='sm' textAlign='left'>
          Anyone within the local network has access to all devices within the network
        </Box>
      </HStack>
      <HStack pt={1}>
        <Box width='20%'>
          <Image src='/assets/images/online.png' width='100%' padding={2}></Image>
        </Box>
        <Box width='100%' fontSize='sm' textAlign='left'>
          The device is controllable from outside the network. Anyone who knows the hub’s ID or has
          access to the user account can see the device&apos;s status.
        </Box>
      </HStack>
    </Stack>
  )
  return (
    <DeviceDocumentationPage
      headerTitle='Security Camera'
      featuresContent={featuresList}
      securityContent={securityList}
      generalInformation={[
        'Device Type: Security Camera',
        'Designed by: LMU',
        'Firmware Version: 1.0',
        'Updated on: 06.02.2023',
        'Manufactured in: Munich',
      ]}
      imagePath='/assets/images/img_cam.png'
    />
  )
}

export { CameraDocumentation }
