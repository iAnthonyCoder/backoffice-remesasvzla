import { call, put, takeEvery } from "redux-saga/effects"

import { GET_CURRENCIES, GET_CURRENCY_PROFILE , ADD_NEW_CURRENCY , DELETE_CURRENCY, UPDATE_CURRENCY } from "./actionTypes"

import {
    getCurrenciesSuccess,
    getCurrenciesFail,
    getCurrencyProfileSuccess,
    getCurrencyProfileFail,
    addCurrencyFail,
    addCurrencySuccess,
    updateCurrencySuccess,
    updateCurrencyFail,
    deleteCurrencySuccess,
    deleteCurrencyFail,
} from "./actions"

import { currencyService } from "services"

function* fetchCurrencies({payload: query}) {
    try {
        const response = yield call(currencyService.list, query)
        yield put(getCurrenciesSuccess(response))
    } catch (error) {
        yield put(getCurrenciesFail(error))
    }
}

function* fetchCurrencyProfile() {
    try {
        const response = yield call(currencyService.find)
        yield put(getCurrencyProfileSuccess(response))
    } catch (error) {
        yield put(getCurrencyProfileFail(error))
    }
}

function* onUpdateCurrency({ payload: currency }) {
    try {
        yield call(currencyService.update, {
            _id:currency._id,
            params:{
                ...currency, 
            }
        })
        yield put(updateCurrencySuccess(currency))
    } catch (error) {
        yield put(updateCurrencyFail(error))
    }
}

function* onDeleteCurrency({ payload: currency }) {
    try {
        const response = yield call(currencyService.delete, currency._id)
        yield put(deleteCurrencySuccess(response))
    } catch (error) {
        yield put(deleteCurrencyFail(error))
    }
}

function* onAddNewCurrency({ payload: currency }) {
    try {
    
        const response = yield call(currencyService.create, {
          ...currency, 
        })
        yield put(addCurrencySuccess(Object.assign({}, currency, response)))
        yield put(addCurrencyFail(null))
    } catch (error) {
 
        yield put(addCurrencyFail(error))
    }
}

function* contactsSaga() {
    yield takeEvery(GET_CURRENCIES, fetchCurrencies)
    yield takeEvery(GET_CURRENCY_PROFILE, fetchCurrencyProfile)
    yield takeEvery(ADD_NEW_CURRENCY, onAddNewCurrency)
    yield takeEvery(UPDATE_CURRENCY, onUpdateCurrency)
    yield takeEvery(DELETE_CURRENCY, onDeleteCurrency)
}

export default contactsSaga;
