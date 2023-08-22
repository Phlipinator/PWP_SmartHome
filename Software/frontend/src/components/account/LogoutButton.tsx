import { useAuth0 } from '@auth0/auth0-react'
import React, { ReactElement } from 'react'
import { Button } from '@chakra-ui/react'

const LogoutButton = (): ReactElement => {
  const { logout } = useAuth0()

  return (
    <Button
      colorScheme='red'
      border='none'
      onClick={(): void => logout({ returnTo: window.location.origin })}
    >
      Log Out
    </Button>
  )
}

export default LogoutButton
