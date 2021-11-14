import { del, get, post, put } from "./../helpers/api_helper"

const login = (params) =>  post('/auth/login', params)

export const authService = {
    login
};