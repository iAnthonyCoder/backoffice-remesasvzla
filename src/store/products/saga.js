import { call, put, takeEvery } from "redux-saga/effects"

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

import { productService } from "services"

function* fetchProducts({payload: query}) {
    try {
        const response = yield call(productService.list, query)
        if(response.totalData.length > 0){
            response.totalData = response.totalData.sort(function(a, b){
                if(a.currency_to_receive.iso_code < b.currency_to_receive.iso_code) { return -1; }
                if(a.currency_to_receive.iso_code > b.currency_to_receive.iso_code) { return 1; }
                return 0;
            })
        }
        console.log(response)
        yield put(getProductsSuccess(response))
    } catch (error) {
        yield put(getProductsFail(error))
    }
}

function* fetchProductProfile() {
    try {
        const response = yield call(productService.find)
        yield put(getProductProfileSuccess(response))
    } catch (error) {
        yield put(getProductProfileFail(error))
    }
}

function* onUpdateProduct({ payload: product }) {
    try {
        yield call(productService.update, {
            _id:product._id,
            params:{
                ...product, 
                _id:product._id, 
                currency_to_deliver: product.currency_to_deliver._id, 
                currency_to_receive: product.currency_to_receive._id
            }
        })
        yield put(updateProductSuccess(product))
    } catch (error) {
        yield put(updateProductFail(error))
    }
}

function* onDeleteProduct({ payload: product }) {
    try {
        const response = yield call(productService.delete, product._id)
        yield put(deleteProductSuccess(response))
    } catch (error) {
        yield put(deleteProductFail(error))
    }
}

function* onAddNewProduct({ payload: product }) {
    try {
        const response = yield call(productService.create, {
          ...product, 
          currency_to_deliver: product.currency_to_deliver._id, 
          currency_to_receive: product.currency_to_receive._id
        })
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
