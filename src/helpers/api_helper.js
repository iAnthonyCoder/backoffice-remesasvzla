import axios from "axios"
//pass new generated access token here

const token = localStorage.getItem("access_token") != null ? 'Bearer '+JSON.parse(localStorage.getItem("access_token")) : sessionStorage.getItem("access_token") != null ? 'Bearer '+JSON.parse(sessionStorage.getItem("access_token")) : null
//apply base url for axios
const API_URL = process.env.REACT_APP_DEFAULTAPI

const axiosApi = axios.create({
  baseURL: API_URL,
})


// axiosApi.defaults.headers.common["Authorization"] = token

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export async function get(url, config = {}) {
  if(sessionStorage.getItem("access_token") || localStorage.getItem("access_token")){
    config = {
      headers: { Authorization: 'Bearer '+(sessionStorage.getItem("access_token") ? JSON.parse(sessionStorage.getItem("access_token")) : JSON.parse(localStorage.getItem("access_token"))) }
  };
  }
  return await axiosApi.get(url, { ...config }).then(response => response.data)
}

export async function post(url, data, config = {}) {
  if(sessionStorage.getItem("access_token") || localStorage.getItem("access_token")){
    config = {
      headers: { Authorization: 'Bearer '+(sessionStorage.getItem("access_token") ? JSON.parse(sessionStorage.getItem("access_token")) : JSON.parse(localStorage.getItem("access_token"))) }
  };
  }
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function put(url, data, config = {}) {
  if(sessionStorage.getItem("access_token") || localStorage.getItem("access_token")){
    config = {
      headers: { Authorization: 'Bearer '+(sessionStorage.getItem("access_token") ? JSON.parse(sessionStorage.getItem("access_token")) : JSON.parse(localStorage.getItem("access_token"))) }
  };
  }
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function del(url, config = {}) {
  if(sessionStorage.getItem("access_token") || localStorage.getItem("access_token")){
    config = {
      headers: { Authorization: 'Bearer '+(sessionStorage.getItem("access_token") ? JSON.parse(sessionStorage.getItem("access_token")) : JSON.parse(localStorage.getItem("access_token"))) }
  };
  }
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}
