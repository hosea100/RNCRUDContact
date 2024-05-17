import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import Constants from 'expo-constants'
import Toast from 'react-native-toast-message'

const DEFAULT_ERROR_MESSAGE = 'Something went wrong'

class Instance {
  instance: AxiosInstance

  constructor(baseUrl?: string) {
    this.instance = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status == 408 || error?.code === 'ECONNABORTED') {
          return Toast.show({
            type: 'error',
            text1: 'Request timeout exceeded',
            text2: "Server didn't return a response within required duration",
            topOffset: 48
          })
        }
        throw error?.response?.data?.data || { message: DEFAULT_ERROR_MESSAGE }
      },
    )

    // this.instance.interceptors.request.use(request => {
    //   console.log('Starting Request', JSON.stringify(request, null, 2))
    //   return request
    //  })

    //  this.instance.interceptors.response.use(response => {
    //   console.log('Response:', JSON.stringify(response, null, 2))
    //   return response
    //  })
  }

  getRequest = (url: string, params: any, other?: AxiosRequestConfig) =>
    this.instance
      .get(url, { ...other, params: { ...(params || {}) } })
      .then(({ data }) => data)
      .catch((error) => ({ error }))

  postRequest = (url: string, body?: unknown, other?: AxiosRequestConfig) =>
    this.instance
      .post(url, body, other)
      .then(({ data }) => data)
      .catch((error) => ({ error }))

  putRequest = (url: string, body?: unknown, other?: AxiosRequestConfig) =>
    this.instance
      .put(url, body, other)
      .then(({ data }) => data)
      .catch((error) => ({ error }))

  patchRequest = (url: string, body?: unknown, other?: AxiosRequestConfig) =>
    this.instance
      .patch(url, body, other)
      .then(({ data }) => data)
      .catch((error) => ({ error }))

  deleteRequest = (url: string, body?: unknown, other?: AxiosRequestConfig) =>
    this.instance
      .delete(url, { ...other, data: body })
      .then(({ data }) => data)
      .catch((error) => ({ error }))
}

const baseURL = `${Constants?.expoConfig?.extra?.apiUrl}/api/v1`

const axiosInstance = new Instance(baseURL)

export default axiosInstance
