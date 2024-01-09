// authActions.js
import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import Cookies from 'cookies-js'

export interface UserType {
    username: string
    email: string
    password: string
}

const backendURL = 'http://localhost:8000'
const csrftoken = Cookies.get('csrftoken')

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ username, email, password }: UserType, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            await axios.post(
                `${backendURL}/api/user/register`,
                { username, email, password },
                config
            )
        } catch (error: any) {
            // return custom error message from backend if present
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const loginUserNeedsToBeFixed = createAsyncThunk(
    'login',
    async ({ username, email, password }: UserType, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                    Accept: 'application/json',
                },
            }
            await axios
                .post(`${backendURL}/reset/login/`, { username, email, password }, config)
                .then((resp) => {
                    console.log('from axios', resp)
                })
        } catch (error: any) {
            // return custom error message from backend if present
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)
