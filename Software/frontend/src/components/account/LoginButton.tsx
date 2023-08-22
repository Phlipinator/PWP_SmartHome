import { useAuth0 } from '@auth0/auth0-react'
import { ReactElement, useEffect, useState } from 'react'
import { Button } from '@chakra-ui/react'

const LoginButton = (): ReactElement => {
  const { loginWithRedirect } = useAuth0()

  return (
    <Button
      colorScheme='telegram'
      border='none'
      w='100%'
      onClick={(): Promise<void> => loginWithRedirect()}
    >
      Sign in
    </Button>
  )
}

export default LoginButton
