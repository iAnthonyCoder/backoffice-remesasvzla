import {
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAIL,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAIL,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  GET_PRODUCT_PROFILE_SUCCESS,
  GET_PRODUCT_PROFILE_FAIL,
} from "./actionTypes"

const INIT_STATE = {
  products: [],
  totalSize: 0,
  from: 0,
  productProfile: {},
  error: {},
}

const contacts = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload.totalData,
        totalSize: action.payload.totalCount[0].count,
        from: action.payload.from,
      }

    case GET_PRODUCTS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        products: [...state.products, action.payload],
        totalSize: state.totalSize+1
      }

    case ADD_PRODUCT_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_PRODUCT_PROFILE_SUCCESS:
   
      return {
        ...state,
        productProfile: action.payload,
      }

      case UPDATE_PRODUCT_SUCCESS:
        return {
          ...state,
          products: state.products.map(product =>
            product._id.toString() === action.payload._id.toString()
              ? { product, ...action.payload }
              : product
          ),
        }
  
      case UPDATE_PRODUCT_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case DELETE_PRODUCT_SUCCESS:
        
        return {
          ...state,
          products: state.products.filter(
            product => product._id.toString() !== action.payload._id.toString()
          ),
          totalSize: state.totalSize-1
        }
  
      case DELETE_PRODUCT_FAIL:
        return {
          ...state,
          error: action.payload,
        }

    case GET_PRODUCT_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

export default contacts
