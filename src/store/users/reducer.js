import {
  GET_USERS_SUCCESS,
  GET_USERS_FAIL,
  ADD_USER_SUCCESS,
  ADD_USER_FAIL,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAIL,
} from "./actionTypes"

const INIT_STATE = {
  users: [],
  totalSize: 0,
  from: 0,
  userProfile: {},
  error: {},
}

const contacts = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload.totalData,
        totalSize: action.payload.totalCount[0].count,
        from: action.payload.from,
      }

    case GET_USERS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case ADD_USER_SUCCESS:
      return {
        ...state,
        users: [...state.users, action.payload],
        totalSize: state.totalSize+1
      }

    case ADD_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_USER_PROFILE_SUCCESS:
   
      return {
        ...state,
        userProfile: action.payload,
      }

      case UPDATE_USER_SUCCESS:
        return {
          ...state,
          users: state.users.map(user =>
            user._id.toString() === action.payload._id.toString()
              ? { user, ...action.payload }
              : user
          ),
        }
  
      case UPDATE_USER_FAIL:
        return {
          ...state,
          error: action.payload,
        }
  
      case DELETE_USER_SUCCESS:
        
        return {
          ...state,
          users: state.users.filter(
            user => user._id.toString() !== action.payload._id.toString()
          ),
          totalSize: state.totalSize-1
        }
  
      case DELETE_USER_FAIL:
        return {
          ...state,
          error: action.payload,
        }

    case GET_USER_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

export default contacts
