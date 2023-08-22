import React from 'react'
import { Flex, Image, Spacer, Text, VStack } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'

// Props of DocOverviewList
interface DocOverviewListProps {
  items: Array<DocOverviewItemProps>
}

// Displays the Data given in the props as a list of clickable cards
const DocOverviewList: React.FC<DocOverviewListProps> = (props) => {
  return (
    <VStack spacing={4}>
      {props.items.map((item, index) => (
        <DocOverviewItem
          key={index}
          deviceName={item.deviceName}
          deviceIconPath={item.deviceIconPath}
          documentationLink={item.documentationLink}
        />
      ))}
    </VStack>
  )
}

// Props of DocOverviewItem
interface DocOverviewItemProps {
  deviceName: string
  deviceIconPath: string
  documentationLink: string
}

// Displays the given data as a clickable card
const DocOverviewItem: React.FC<DocOverviewItemProps> = (props) => {
  const navigate = useNavigate()

  const navigateToDocPage = (): void => {
    navigate(props.documentationLink)
  }

  return (
    <Flex
      alignItems='center'
      boxSizing='border-box'
      w='100%'
      h={20}
      p={4}
      borderRadius={4}
      bgColor='customBackground.card'
      _hover={{ bgColor: 'customBackground.cardHover' }}
      cursor='pointer'
      onClick={navigateToDocPage}
    >
      <Image
        src={process.env.PUBLIC_URL + '/assets/images/' + props.deviceIconPath}
        height='100%'
        mr={4}
      />
      <Text fontSize='xl' fontWeight='semibold'>
        {props.deviceName}
      </Text>
      <Spacer />
      <ChevronRightIcon h='custom.arrowIcon' w='custom.arrowIcon' />
    </Flex>
  )
}

export { DocOverviewList }
export type { DocOverviewItemProps }
