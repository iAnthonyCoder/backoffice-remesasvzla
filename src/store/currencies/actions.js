import {
  GET_CURRENCY_PROFILE,
  GET_CURRENCY_PROFILE_FAIL,
  GET_CURRENCY_PROFILE_SUCCESS,
  GET_CURRENCIES,
  GET_CURRENCIES_FAIL,
  GET_CURRENCIES_SUCCESS,
  ADD_NEW_CURRENCY,
  ADD_CURRENCY_SUCCESS,
  ADD_CURRENCY_FAIL,
  UPDATE_CURRENCY,
  UPDATE_CURRENCY_SUCCESS,
  UPDATE_CURRENCY_FAIL,
  DELETE_CURRENCY,
  DELETE_CURRENCY_SUCCESS,
  DELETE_CURRENCY_FAIL,
} from "./actionTypes"

export const getCurrencies = (query) => ({
  type: GET_CURRENCIES,
  query: query
})

export const getCurrenciesSuccess = currencies => ({
  type: GET_CURRENCIES_SUCCESS,
  payload: currencies,
})

export const addNewCurrency = currency => ({
  type: ADD_NEW_CURRENCY,
  payload: currency,
})

export const addCurrencySuccess = currency => ({
  type: ADD_CURRENCY_SUCCESS,
  payload: currency,
})

export const addCurrencyFail = error => ({
  type: ADD_CURRENCY_FAIL,
  payload: error,
})

export const getCurrenciesFail = error => ({
  type: GET_CURRENCIES_FAIL,
  payload: error,
})

export const getCurrencyProfile = () => ({
  type: GET_CURRENCY_PROFILE,
})

export const getCurrencyProfileSuccess = currencyProfile => ({
  type: GET_CURRENCY_PROFILE_SUCCESS,
  payload: currencyProfile,
})

export const getCurrencyProfileFail = error => ({
  type: GET_CURRENCY_PROFILE_FAIL,
  payload: error,
})

export const updateCurrency = currency => ({
  type: UPDATE_CURRENCY,
  payload: currency,
})

export const updateCurrencySuccess = currency => ({
  type: UPDATE_CURRENCY_SUCCESS,
  payload: currency,
})

export const updateCurrencyFail = error => ({
  type: UPDATE_CURRENCY_FAIL,
  payload: error,
})

export const deleteCurrency = currency => ({
  type: DELETE_CURRENCY,
  payload: currency,
})

export const deleteCurrencySuccess = currency => ({
  type: DELETE_CURRENCY_SUCCESS,
  payload: currency,
})

export const deleteCurrencyFail = error => ({
  type: DELETE_CURRENCY_FAIL,
  payload: error,
})
