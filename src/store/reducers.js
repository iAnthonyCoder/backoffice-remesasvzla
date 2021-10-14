import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

//E-commerce
import ecommerce from "./e-commerce/reducer"

//Calendar
import calendar from "./calendar/reducer"

//chat
import chat from "./chat/reducer"

//crypto
import crypto from "./crypto/reducer"

//invoices
import invoices from "./invoices/reducer"

//projects
import projects from "./projects/reducer"

//mails
import mails from "./mails/reducer"

//tasks
import currencies from "./currencies/reducer"
import products from "./products/reducer"

//contacts
import contacts from "./users/reducer"

//accounts
// import accounts from "./accounts/reducer"

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  ecommerce,
  calendar,
  mails,
  chat,
  crypto,
  invoices,
  projects,
  currencies,
  products,
  contacts,
  // accounts,
})

export default rootReducer
