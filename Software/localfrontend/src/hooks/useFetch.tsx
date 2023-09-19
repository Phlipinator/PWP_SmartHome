import { middlewareURL } from '../environmentVariables'

// hook for get, post and delete requests to the backend API
const useFetch = () => {
  /**
   * retrieves data from the backend through a get request
   *
   * @param {string} url the API url that you want to fetch
   * @return {Promise} a promise with the response JSON of the get request
   */
  const getRequest = (url: string) => {
    return fetch(url, {
      method: 'GET',
      // headers: {
      //   authorization: `Bearer ${token}`,
      // },
    }).then((response) => {
      if (response.status == 200) {
        console.log('SUCCESS')
        return response.json()
      } else {
        throw `Error during Get Request. Code: ${response.status}`
      }
    })
  }

  /**
   * post request to the backend
   *
   * @param {string} url the API url that you want to post to
   * @param {BodyInit} body the body of the post request (attention: needs to be in JSON format!)
   * @return {Promise} a promise of the request
   */
  const postRequest = (url: string, body: BodyInit) => {
    return fetch(url, {
      method: 'POST',
      body: body,
      headers: {
        contentType: 'application/json',
      },
    }).then((response) => {
      if (response.status == 200) {
        console.log('SUCCESS')
        return response
      } else {
        throw `Error posting the request. Code: ${response.status}`
      }
    })
  }

  /**
   * delete request to the backend
   *
   * @param {string} url the API url that you want to access to delete something
   * @param {BodyInit} body the body of the delete request (attention: needs to be in JSON format!)
   * @return {Promise} a promise of the request
   */
  const deleteRequest = (url: string) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.status != 200) {
        throw `Error during delete request. Error code: ${response.status}`
      } else {
        console.log('SUCCESS')
        return response
      }
    })
  }

  return { getRequest, postRequest, deleteRequest }
}

export default useFetch
