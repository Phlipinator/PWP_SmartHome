import Page from '../../Page'
import {
  Heading,
  Image,
  VStack,
  Card,
  CardBody,
  Box,
  StackDivider,
  Stack,
  HStack,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import SegmentedControl from '../../ui-elements/SegmentedControl'

interface DeviceDocumentationPageProps {
  featuresContent: React.ReactNode
  securityContent: React.ReactNode
  generalInformation: string[]
  imagePath: string
  headerTitle: string
}
const DeviceDocumentationPage: React.FC<DeviceDocumentationPageProps> = ({
  headerTitle,
  featuresContent,
  securityContent,
  generalInformation,
  imagePath,
}: DeviceDocumentationPageProps) => {
  const [viewSelected, setViewSelected] = useState<string>('features')

  return (
    <Page headerName={headerTitle} hasBackButton={true} backButtonDestination='/documentation'>
      <VStack>
        <Image src={imagePath} borderRadius='5px' />
        <Card backgroundColor='customBackground.card' color='white' w='100%'>
          <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                  General Information
                </Heading>
                <Box pt='4' fontSize='sm' textAlign='left'>
                  {generalInformation.map((item, id) => {
                    return <Box key={id}>{item}</Box>
                  })}
                </Box>
              </Box>
              <Box>
                <Heading size='xs' textTransform='uppercase'>
                  Privacy & Security
                </Heading>
                <HStack pt='4'>
                  <Box fontSize='sm' width='20%'>
                    Mode
                  </Box>
                  <SegmentedControl
                    name='group-1'
                    callback={(val) => setViewSelected(val)}
                    controlRef={useRef()}
                    segments={[
                      {
                        label: 'Features',
                        value: 'features',
                        ref: useRef(),
                      },
                      {
                        label: 'Security Risks',
                        value: 'security',
                        ref: useRef(),
                      },
                    ]}
                  />
                </HStack>
                <Card backgroundColor='customBackground.card' color='white' boxShadow='none' pt={2}>
                  {viewSelected == 'features' ? featuresContent : securityContent}
                </Card>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </VStack>
    </Page>
  )
}
export { DeviceDocumentationPage }
