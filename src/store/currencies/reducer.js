import {
  GET_CURRENCIES_SUCCESS,
  GET_CURRENCIES_FAIL,
  ADD_CURRENCY_SUCCESS,
  ADD_CURRENCY_FAIL,
  UPDATE_CURRENCY_SUCCESS,
  UPDATE_CURRENCY_FAIL,
  DELETE_CURRENCY_SUCCESS,
  DELETE_CURRENCY_FAIL,
  GET_CURRENCY_PROFILE_SUCCESS,
  GET_CURRENCY_PROFILE_FAIL,
} from "./actionTypes"

const INIT_STATE = {
  currencies: [],
  totalSize: 0,
  from: 0,
  currencyProfile: {},
  error: {},
}

const contacts = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CURRENCIES_SUCCESS:
      return {
        ...state,
        currencies: action.payload.totalData,
        totalSize: action.payload.totalCount[0].count,
        from: action.payload.from,
      }

    case GET_CURRENCIES_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case ADD_CURRENCY_SUCCESS:
      return {
        ...state,
        currencies: [...state.currencies, action.payload],
        totalSize: state.totalSize+1
      }

    case ADD_CURRENCY_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_CURRENCY_PROFILE_SUCCESS:
   
      return {
        ...state,
        currencyProfile: action.payload,
      }

      case UPDATE_CURRENCY_SUCCESS:
        return {
          ...state,
          currencies: state.currencies.map(currency =>
            currency._id.toString() === action.payload._id.toString()
              ? { currency, ...action.payload }
              : currency
          ),
        }
  
      case UPDATE_CURRENCY_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case DELETE_CURRENCY_SUCCESS:
        
        return {
          ...state,
          currencies: state.currencies.filter(
            currency => currency._id.toString() !== action.payload._id.toString()
          ),
          totalSize: state.totalSize-1
        }
  
      case DELETE_CURRENCY_FAIL:
        return {
          ...state,
          error: action.payload,
        }

    case GET_CURRENCY_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

export default contacts
