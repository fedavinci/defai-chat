import axios, { AxiosResponse } from 'axios'
import { message } from 'antd'
// import { getToken } from '../utils/user-token'

const instance = axios.create({
  baseURL: 'https://sonic.buymeacryptocoffee.top',
  timeout: 30 * 1000,
})

// request 拦截：每次请求都带上 token
instance.interceptors.request.use(
  config => {
    // config.headers['Authorization'] = `Bearer ${getToken()}` // JWT 的固定格式
    return config
  },
  error => Promise.reject(error)
)

// response 拦截：统一处理 errno 和 msg
instance.interceptors.response.use(res => {
  const resData = (res.data || {}) as ResType
  const { status, result, msg } = resData

  if (status !== "success") {
    // 错误提示
    if (msg) {
      message.error(msg)
    }

    throw new Error(msg)
  }

  return result as any
})

export default instance

export type ResType = {
  status: string
  result?: ResDataType
  msg?: string
}

export type ResDataType = {
  [key: string]: any
}