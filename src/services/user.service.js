import axios from "axios";
let API_URL = process.env.REACT_APP_DEFAULTAPI

export const userService = {
    updateOwn
};

function updateOwn(params) {
    return axios.put(`${API_URL}/users`, params);
}