import { useAuth0 } from '@auth0/auth0-react'
import React, { ReactElement, useEffect, useState } from 'react'
import Page from '../Page'
import { useNavigate } from 'react-router-dom'
import { backendURL } from '../../environmentVariables'

const CallbackPage = (): ReactElement => {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0()
  const [loginInProgress, setLoginInProgress] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && !loginInProgress) {
        setLoginInProgress(true)
        getAccessTokenSilently().then((tokenResult) => {
          console.log('TOKEN: ' + tokenResult)
          doLogin(tokenResult)
        })
      }
    }
  }, [isLoading, isAuthenticated])

  const doLogin = (token: string): void => {
    console.log('BACKEND_URL: ' + backendURL)
    try {
      if (typeof user != 'undefined' && typeof user.email != 'undefined') {
        fetch(`${backendURL}/api/login?userID=${user.email}`, {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          if (response.status == 200) {
            navigate('/devices')
          }
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  return <Page headerName='' hasBackButton={false}></Page>
}

export default CallbackPage
