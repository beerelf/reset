// features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { registerUser } from './authActions'

const initialState = {
    loading: false,
    userInfo: {}, // for user object
    userToken: null, // for storing the JWT
    error: null,
    success: false, // for monitoring the registration process.
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: {
        // register user
        // @ts-ignore
        [registerUser.pending]: (state) => {
            state.loading = true
            state.error = null
        },
        // @ts-ignore
        [registerUser.fulfilled]: (state, { payload }) => {
            state.loading = false
            state.success = true // registration successful
        },
        // @ts-ignore
        [registerUser.rejected]: (state, { payload }) => {
            state.loading = false
            state.error = payload
        },
    },
})

export default authSlice.reducer
