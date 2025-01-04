import { createSlice } from '@reduxjs/toolkit'
import { Feature } from 'ol'

export interface LoginType {
    username: string
    aoi: Feature[]
    aoifeats: Feature[]
}

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        username: null,
        aoi: null,
        aoifeats: null,
    },
    reducers: {
        login: (state, action) => void (state.username = action.payload),
        setaoi: (state, action) => void (state.aoi = action.payload),
        setaoifeats: (state, action) => void (state.aoifeats = action.payload),
    },
})

// Action creators are generated for each case reducer function
export const { login, setaoi, setaoifeats } = loginSlice.actions

export default loginSlice.reducer
