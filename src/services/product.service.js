import { del, get, post, put } from "./../helpers/api_helper"

const list = (query = '') => get('products'+query)

const find = (id) => get('products/'+id)

const create = (params) => post('products', params)

const update = ({_id, params}) => put(`products/${_id}`, params)

const _delete = (id) => del(`products/${id}`)

export const productService = {
    list,
    find,
    create,
    update,
	delete: _delete,
};