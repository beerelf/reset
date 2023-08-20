import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../components/loginSlice'

export default configureStore({
    reducer: { login: loginReducer },
})
