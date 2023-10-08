import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../components/loginSlice'

import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'

export default configureStore({
    reducer: { login: loginReducer },
})
