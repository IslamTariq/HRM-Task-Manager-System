import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: basic response passthrough
api.interceptors.response.use(
  (resp) => resp,
  (error) => Promise.reject(error)
)

export default api

