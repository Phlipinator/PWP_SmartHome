import { useAuth0 } from '@auth0/auth0-react'
import React, { ReactElement } from 'react'
import { Divider, Text, VStack } from '@chakra-ui/react'
import Page from '../../Page'
import LogoutButton from '../../account/LogoutButton'

const Profile = (): ReactElement => {
  const { user, isAuthenticated } = useAuth0()

  return (
    <Page headerName='Your Profile' hasBackButton={true}>
      {isAuthenticated ? (
        <VStack alignItems='center'>
          <img src={user ? user.picture : undefined} alt={user ? user.name : 'Undefined'} />
          <Divider />
          <Text flex='1' textAlign='left' fontWeight='semibold'>
            Account Name
          </Text>
          <Text flex='1' textAlign='left'>
            {user ? user.name : 'Undefined'}
          </Text>
          <Divider />
          <Text flex='1' textAlign='left' fontWeight='semibold'>
            Account E-Mail
          </Text>
          <Text flex='1' textAlign='left'>
            {user ? user.email : 'No Email'}
          </Text>
          <Divider />
          <LogoutButton />
        </VStack>
      ) : (
        []
      )}
    </Page>
  )
}

export default Profile
