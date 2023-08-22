import Page from '../../Page'
import { ReactElement, useEffect, useState } from 'react'
import { Text, PinInput, PinInputField, HStack, VStack, Box, Button } from '@chakra-ui/react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { backendURL } from '../../../environmentVariables'
import useAuthentication from '../../../hooks/useAuthentication'
import useFetch from '../../../hooks/useFetch'
const EnterHubID = (): ReactElement => {
  const { token, user } = useAuthentication()
  const [hubId, setHubId] = useState<string>('')
  const navigate = useNavigate()
  const { postRequest } = useFetch()

  const addHub = (): void => {
    try {
      if (typeof user != 'undefined' && typeof user.email != 'undefined') {
        postRequest(
          `${backendURL}/api/addNetwork`,
          JSON.stringify({
            networkId: hubId,
          }),
        )
          .then((response) => response.json())
          .then((data) => console.log(data))
          .then(() => {
            navigate('/devices')
          })
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Page headerName='Add Hub' hasBackButton={true} backButtonDestination='/devices'>
      <Box backgroundColor='customBackground.card' padding={5}>
        <VStack spacing={6}>
          <Text margin={0} textAlign='left'>
            Please turn on Online Mode on the devices you want to control and type in the unique ID
            of your hub.
          </Text>
          <HStack justify='center'>
            <PinInput type='alphanumeric' onComplete={(value) => setHubId(value)}>
              <PinInputField color='white' />
              <PinInputField color='white' />
              <PinInputField color='white' />
              <PinInputField color='white' />
              <PinInputField color='white' />
            </PinInput>
          </HStack>
          <Text textAlign='left'>
            By continuing, you agree that we add your devices to your account so they can be
            accessible from outside your network.
          </Text>
        </VStack>
      </Box>
      <Button
        mt={4}
        colorScheme='telegram'
        border='none'
        onClick={() => {
          try {
            if (hubId !== '') {
              addHub()
            }
          } catch (e) {
            console.error(e)
          }
        }}
      >
        Continue
      </Button>
    </Page>
  )
}

export { EnterHubID }
