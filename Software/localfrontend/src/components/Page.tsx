import React, { ReactNode } from 'react'
import { Box, HStack, Text, Image } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

interface PageProps {
  headerName: string
  hasBackButton: boolean
  backButtonDestination?: string
  children?: ReactNode
}

// this component serves as a template for all pages and renders a header and optional back button
// the content of each page should be placed as children within the <Page> tags

const Page: React.FC<PageProps> = ({
  headerName,
  hasBackButton,
  backButtonDestination,
  children,
}: PageProps) => {
  const navigate = useNavigate()

  const handleBackPress = (): void => {
    if (backButtonDestination) {
      navigate(backButtonDestination)
    } else {
      navigate(-1)
    }
  }

  return (
    <>
      {/* Header */}
      <HStack
        paddingLeft={4}
        py={2}
        justify='space-between'
        h='55px'
        alignItems='center'
        borderBottom='2px solid grey'
      >
        <HStack h='100%'>
          {hasBackButton ? (
            <ArrowBackIcon
              height='100%'
              width='auto'
              ml={-1}
              cursor='pointer'
              onClick={handleBackPress}
            ></ArrowBackIcon>
          ) : (
            []
          )}
          <Text fontSize='xl' fontWeight='bold'>
            {headerName}
          </Text>
        </HStack>
      </HStack>

      <Box p={4} minH='100%'>
        {children}
      </Box>
    </>
  )
}

export default Page
