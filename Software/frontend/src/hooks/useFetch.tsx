import { backendURL } from '../environmentVariables'
import useAuthentication from './useAuthentication'
import { Dispatch, SetStateAction } from 'react'

// hook for get, post and delete requests to the backend API
const useFetch = (setComponentLoading?: Dispatch<SetStateAction<boolean>>) => {
  const { token, user } = useAuthentication()

  /**
   * retrieves data from the backend through a get request
   *
   * @param {string} url the API url that you want to fetch
   * @return {Promise} a promise with the response JSON of the get request
   */
  const getRequest = (url: string) => {
    try {
      if (token != '') {
        return fetch(url, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          if (response.status == 200) {
            console.log('SUCCESS')
            return response.json()
          } else {
            setComponentLoading ? setComponentLoading(false) : null
            throw `Error during Get Request. Code: ${response.status}`
          }
        })
      } else {
        return Promise.reject(new Error('No Auth 0 token found.'))
      }
    } catch (error) {
      console.log(error)
      setComponentLoading ? setComponentLoading(false) : null
      return Promise.reject(new Error('No Auth 0 token found.'))
    }
  }

  /**
   * post request to the backend
   *
   * @param {string} url the API url that you want to post to
   * @param {BodyInit} body the body of the post request (attention: needs to be in JSON format!)
   * @return {Promise} a promise of the request
   */
  const postRequest = (url: string, body: BodyInit) => {
    try {
      if (token != '') {
        return fetch(url, {
          method: 'POST',
          body: body,
          headers: {
            authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          if (response.status == 200) {
            console.log('SUCCESS')
            return response
          } else {
            setComponentLoading ? setComponentLoading(false) : null
            throw `Error posting the request. Code: ${response.status}`
          }
        })
      } else {
        return Promise.reject(new Error('No Auth 0 token found.'))
      }
    } catch (error) {
      console.log(error)
      setComponentLoading ? setComponentLoading(false) : null
      return Promise.reject(new Error('No Auth 0 token found.'))
    }
  }

  /**
   * delete request to the backend
   *
   * @param {string} url the API url that you want to access to delete something
   * @param {BodyInit} body the body of the delete request (attention: needs to be in JSON format!)
   * @return {Promise} a promise of the request
   */
  const deleteRequest = (url: string) => {
    try {
      if (typeof user != 'undefined' && typeof user.email != 'undefined' && token != '') {
        return fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          if (response.status != 200) {
            setComponentLoading ? setComponentLoading(false) : null
            throw `Error during delete request. Error code: ${response.status}`
          } else {
            console.log('SUCCESS')
            return response
          }
        })
      } else {
        return Promise.reject(new Error('No user or Auth 0 token found.'))
      }
    } catch (error) {
      console.log(error)
      setComponentLoading ? setComponentLoading(false) : null
      return Promise.reject(new Error('No Auth 0 token found.'))
    }
  }

  return { getRequest, postRequest, deleteRequest }
}

export default useFetch
