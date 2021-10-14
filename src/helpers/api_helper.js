import axios from "axios"
//pass new generated access token here
const token = localStorage.getItem("access_token") ? 'Bearer '+JSON.parse(localStorage.getItem("access_token")) : ''

//apply base url for axios
const API_URL = process.env.REACT_APP_DEFAULTAPI

const axiosApi = axios.create({
  baseURL: API_URL,
})

console.log(token)

axiosApi.defaults.headers.common["Authorization"] = token

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config }).then(response => response.data)
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}