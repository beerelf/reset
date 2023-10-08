import { createSlice } from '@reduxjs/toolkit'
import { Feature } from 'ol'

export interface LoginType {
    username: string
    aoi: Feature[]
}

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        username: null,
        aoi: null,
    },
    reducers: {
        login: (state, action) => {
            state.username = action.payload
        },
        setaoi: (state, action) => {
            state.aoi = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { login } = loginSlice.actions

export default loginSlice.reducer
