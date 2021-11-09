const API_URL = process.env.REACT_APP_DEFAULTAPI

const axiosApi = axios.create({
    baseURL: API_URL,
})

axiosApi.defaults.headers.common["Authorization"] = token

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export {
    axiosApi
}