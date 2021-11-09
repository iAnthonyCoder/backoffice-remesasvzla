import { call, put, takeEvery, takeLatest } from "redux-saga/effects"

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN, UPDATE_ME } from "./actionTypes"
import { apiError, loginSuccess, updateMe, updateMeSuccess } from "./actions"

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
  getMe
} from "../../../helpers/fakebackend_helper"
// const jwt = require('jsonwebtoken');
import jwt from 'jwt-decode' 
import { userService } from "services"

const fireBaseBackend = getFirebaseBackend()

function* loginUser({ payload: { user, history } }) {
  try {
        const response = yield call(postJwtLogin, {
        email: user.email,
        password: user.password,
      })
      const { code, data } = response
      console.log(response)
      if(code){
        console.log(data)
        throw new Error(data.message || data.errors[0]['message'])
      } else {
        localStorage.setItem("authUser", JSON.stringify(jwt(response.response)))
        localStorage.setItem("access_token", JSON.stringify(response.response))
        yield put(loginSuccess(jwt(response.response)))
      }
    history.push("/dashboard")
  } catch (error) {
    if(error.message.includes('401')){
      yield put(apiError('Incorrect credentials'))
    } else {
      yield put(apiError(error.message))
    }
    
  }
}

function* onUpdateMe({ payload: { user } }) {
  try {
    console.log('xxxxxxxxxxxxx')
    yield call(userService.updateOwn(user))
    yield put(updateMeSuccess(user))
  } catch (error) {
    if(error.message.includes('401')){
      yield put(apiError('Incorrect credentials'))
    } else {
      yield put(apiError(error.message))
    }
    
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser")
    localStorage.removeItem("access_token")
    history.push("/login")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
     
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend()
      const response = yield call(
        fireBaseBackend.socialLoginUser,
        data,
        type,
      )
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    } else {
      const response = yield call(postSocialLogin, data)
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    }
    history.push("/dashboard")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeEvery(UPDATE_ME, onUpdateMe)
  yield takeLatest(SOCIAL_LOGIN, socialLogin)
  yield takeEvery(LOGOUT_USER, logoutUser)
}

export default authSaga
