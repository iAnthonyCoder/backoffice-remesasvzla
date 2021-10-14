import {
  GET_PRODUCT_PROFILE,
  GET_PRODUCT_PROFILE_FAIL,
  GET_PRODUCT_PROFILE_SUCCESS,
  GET_PRODUCTS,
  GET_PRODUCTS_FAIL,
  GET_PRODUCTS_SUCCESS,
  ADD_NEW_PRODUCT,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  DELETE_PRODUCT,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
} from "./actionTypes"

export const getProducts = (query) => ({
  type: GET_PRODUCTS,
  query: query
})

export const getProductsSuccess = products => ({
  type: GET_PRODUCTS_SUCCESS,
  payload: products,
})

export const addNewProduct = product => ({
  type: ADD_NEW_PRODUCT,
  payload: product,
})

export const addProductSuccess = product => ({
  type: ADD_PRODUCT_SUCCESS,
  payload: product,
})

export const addProductFail = error => ({
  type: ADD_PRODUCT_FAIL,
  payload: error,
})

export const getProductsFail = error => ({
  type: GET_PRODUCTS_FAIL,
  payload: error,
})

export const getProductProfile = () => ({
  type: GET_PRODUCT_PROFILE,
})

export const getProductProfileSuccess = productProfile => ({
  type: GET_PRODUCT_PROFILE_SUCCESS,
  payload: productProfile,
})

export const getProductProfileFail = error => ({
  type: GET_PRODUCT_PROFILE_FAIL,
  payload: error,
})

export const updateProduct = product => ({
  type: UPDATE_PRODUCT,
  payload: product,
})

export const updateProductSuccess = product => ({
  type: UPDATE_PRODUCT_SUCCESS,
  payload: product,
})

export const updateProductFail = error => ({
  type: UPDATE_PRODUCT_FAIL,
  payload: error,
})

export const deleteProduct = product => ({
  type: DELETE_PRODUCT,
  payload: product,
})

export const deleteProductSuccess = product => ({
  type: DELETE_PRODUCT_SUCCESS,
  payload: product,
})

export const deleteProductFail = error => ({
  type: DELETE_PRODUCT_FAIL,
  payload: error,
})
