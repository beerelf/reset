import { createSlice } from '@reduxjs/toolkit'

export interface LoginType {
    login: {
        username: string
    }
}

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        user: null,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { login } = loginSlice.actions

export default loginSlice.reducer
