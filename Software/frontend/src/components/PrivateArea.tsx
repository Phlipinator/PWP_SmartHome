import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { ReactNode, useEffect, useState } from 'react'
import { Button, VStack } from '@chakra-ui/react'
import Page from './Page'
import LoginButton from './account/LoginButton'

interface PrivateRouteProps {
  children: ReactNode
}

export { PrivateArea }

const PrivateArea = ({ children }: PrivateRouteProps): JSX.Element => {
  const { isAuthenticated } = useAuth0()
  const navigate = useNavigate()

  return (
    <>
      {isAuthenticated ? (
        children
      ) : (
        <Page headerName='Not authorized' hasBackButton={false}>
          <VStack>
            <div> To access this page you need to log in first. </div> <LoginButton />
            <Button
              onClick={() => {
                navigate('/')
              }}
            >
              Go to Home
            </Button>
          </VStack>
        </Page>
      )}
    </>
  )
}

export default PrivateArea
