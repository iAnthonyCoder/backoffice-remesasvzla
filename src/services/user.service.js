import axios from "axios";
import { del, get, post, put } from "./../helpers/api_helper"

export const userService = {
    updateOwn
};

async function updateOwn(params) {
   return put(`/users/me`, params);
}