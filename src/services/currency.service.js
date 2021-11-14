import { del, get, post, put } from "./../helpers/api_helper"

const list = (query = '') => get('currencies'+query)

const find = (id) => get('currencies/'+id)

const create = (params) => post('currencies', params)

const update = ({_id, params}) => put(`currencies/${_id}`, params)

const _delete = (id) => del(`currencies/${id}`)

export const currencyService = {
    list,
    find,
    create,
    update,
	delete: _delete,
};