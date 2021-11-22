import { del, get, post, put } from "./../helpers/api_helper"

const list = (query = '') => get('refreshes'+query)

const find = (id) => get('refreshes/'+id)

const create = (params) => post('refreshes', params)

const update = (id, params) => put(`refreshes/${id}`, params)

const _delete = (id) => del(`refreshes/${id}`)

const getFromSheet = (params) => get('refreshes/sheet'+params)

export const refreshService = {
    list,
    find,
    create,
    update,
    getFromSheet,
	delete: _delete,
};
