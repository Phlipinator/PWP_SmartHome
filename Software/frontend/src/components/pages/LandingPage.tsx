import React, { ReactElement, useEffect } from 'react'
import Page from '../Page'
import LoginButton from '../account/LoginButton'
import { useAuth0 } from '@auth0/auth0-react'
import { Button, Image, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { backendURL, frontendURL } from '../../environmentVariables'
const LandingPage = (): ReactElement => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth0()

  useEffect(() => {
    console.log(`BACKEND_URL: ${backendURL}`)
    console.log(`FRONTEND_URL: ${frontendURL}`)
  }, [])

  return (
    <Page headerName='Welcome!' hasBackButton={false}>
      <VStack mt='15vh'>
        <Image src={process.env.PUBLIC_URL + '/assets/images/pwp_logo.png'} height='100%' mb={4} />
        {!isAuthenticated ? <LoginButton /> : []}

        {isAuthenticated ? (
          <Button
            colorScheme='telegram'
            border='none'
            w='100%'
            onClick={(): void => {
              navigate('/devices')
            }}
          >
            Control your devices
          </Button>
        ) : (
          []
        )}

        <Button
          colorScheme='telegram'
          border='none'
          w='100%'
          onClick={(): void => {
            navigate('/documentation')
          }}
        >
          Device Documentation
        </Button>
      </VStack>
    </Page>
  )
}

export { LandingPage }
