import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

// handles the auth0 authentication and returns the current user and token
const useAuthentication = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0()
  // Auth0 token
  const [token, setToken] = useState<string>('')

  // Get Auth0 token
  useEffect(() => {
    if (!isLoading) {
      try {
        getAccessTokenSilently().then((tokenResult) => {
          // console.log('TOKEN: ' + tokenResult)
          setToken(tokenResult)
        })
        if (typeof user != 'undefined') {
          // console.log(`E-MAIL: ${user.email}`)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }, [isLoading])

  return { token, user }
}

export default useAuthentication
