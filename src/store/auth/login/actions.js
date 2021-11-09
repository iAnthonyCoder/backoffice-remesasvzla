import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SOCIAL_LOGIN,
  UPDATE_USER,
  UPDATE_ME,
  UPDATE_ME_SUCCESS,
  UPDATE_ME_FAIL,
} from "./actionTypes"

export const loginUser = (user, history) => {
  return {
    type: LOGIN_USER,
    payload: { user, history },
  }
}

export const loginSuccess = user => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  }
}

export const updateMeFail = user => {
  return {
    type: UPDATE_ME_FAIL,
    payload: user,
  }
}

export const updateMeSuccess = user => {
  return {
    type: UPDATE_ME_SUCCESS,
    payload: user,
  }
}

export const updateMe = user => ({
  type: UPDATE_ME,
  payload: user,
})

export const logoutUser = history => {
  return {
    type: LOGOUT_USER,
    payload: { history },
  }
}

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  }
}

export const apiError = error => {
  return {
    type: API_ERROR,
    payload: error,
  }
}

export const socialLogin = (data, history, type) => {
  return {
    type: SOCIAL_LOGIN,
    payload: { data, history, type },
  }
}
