import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { GET_PRODUCTS, GET_PRODUCT_PROFILE , ADD_NEW_PRODUCT , DELETE_PRODUCT, UPDATE_PRODUCT } from "./actionTypes"

import {
  getProductsSuccess,
  getProductsFail,
  getProductProfileSuccess,
  getProductProfileFail,
  addProductFail,
  addProductSuccess,
  updateProductSuccess,
  updateProductFail,
  deleteProductSuccess,
  deleteProductFail,
} from "./actions"

//Include Both Helper File with needed methods
import { getProducts, getProductProfile , addNewProduct, updateProduct ,deleteProduct } from "../../helpers/fakebackend_helper"

function* fetchProducts(query) {
  try {
    console.log(yield call(getProducts, query))
    const response = yield call(getProducts, query)
    console.log('aaaaaaaaaaa')
    
    yield put(getProductsSuccess(response))
  } catch (error) {
    console.log(error)
    yield put(getProductsFail(error))
  }
}

function* fetchProductProfile() {
  try {
    const response = yield call(getProductProfile)
    yield put(getProductProfileSuccess(response))
  } catch (error) {
    yield put(getProductProfileFail(error))
  }
}

function* onUpdateProduct({ payload: product }) {
  try {
    yield call(updateProduct, product)
    yield put(updateProductSuccess(product))
  } catch (error) {
    yield put(updateProductFail(error))
  }
}

function* onDeleteProduct({ payload: product }) {
  try {
    const response = yield call(deleteProduct, product)
    yield put(deleteProductSuccess(response))
  } catch (error) {
    yield put(deleteProductFail(error))
  }
}

function* onAddNewProduct({ payload: product }) {

  try {
    const response = yield call(addNewProduct, product)
    yield put(addProductSuccess(Object.assign({}, product, response)))
    yield put(addProductFail(null))
  } catch (error) {

    yield put(addProductFail(error))
  }
}

function* contactsSaga() {
  yield takeEvery(GET_PRODUCTS, fetchProducts)
  yield takeEvery(GET_PRODUCT_PROFILE, fetchProductProfile)
  yield takeEvery(ADD_NEW_PRODUCT, onAddNewProduct)
  yield takeEvery(UPDATE_PRODUCT, onUpdateProduct)
  yield takeEvery(DELETE_PRODUCT, onDeleteProduct)
}

export default contactsSaga;
