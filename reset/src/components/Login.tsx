import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import Checkbox from '@mui/joy/Checkbox'
import Grid from '@mui/joy/Grid'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import React, { useEffect } from 'react'
import Cookies from 'cookies-js'
import { useDispatch, useSelector } from 'react-redux'
import { gql, useQuery } from '@apollo/client'
import { LoginType, loginSlice } from './loginSlice'
import authSlice from './authSlice'
// import { loginUser } from './authActions'
import { ResetState } from '../App'

const csrftoken = Cookies.get('csrftoken')

// If the server is at 3000 then assume this is a development instance with the server on 8000
export const host =
    window.location.host.indexOf('3000') > 0
        ? `${window.location.protocol}//${window.location.hostname}:8000`
        : window.location.origin

export default function SignIn() {
    const login = useSelector((state: ResetState) => state.login)
    const user = useSelector((state: ResetState) => state.user)
    const dispatch = useDispatch()

    console.log('login', login, 'user', user)

    // This doesn't work
    // const GET_USERS = gql`
    //     query GetUsers {
    //         users {
    //             id
    //             username
    //             email
    //             password
    //         }
    //     }
    // `

    // const ADD_USER = gql`
    //     mutation AddUser {
    //         register($input: PutUserMutationPayload) {
    //             success, errors, token
    //         }
    //     }`

    // const { loading, error, data: users } = useQuery(GET_USERS)
    // console.log(loading, error, users)
    // ** end doesn't work

    const handleSubmitShitty = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        const data = new FormData(event.currentTarget)
        const formdata = {
            username: data.get('username'),
            password: data.get('password'),
        }
        // @ts-ignore
        dispatch(loginUser(formdata))
    }

    const getState = async () => {}

    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const username = data.get('username')?.toString() || ''
        const password = data.get('password')?.toString() || ''
        const loginFunc: any = async () => {
            let ret
            if (newUser) {
                setUsername(username)
                setPassword(password)
                const formdata = {
                    username: data.get('username'),
                    password: data.get('password'),
                    password_confirmed: data.get('password_confirmed'),
                    email: data.get('email'),
                }
                ret = await fetch(`${host}/reset/newuser/`, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(formdata),
                    headers: {
                        'X-CSRFToken': csrftoken,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                })
            } else {
                const formdata = {
                    username: data.get('username'),
                    password: data.get('password'),
                }
                ret = await fetch(`${host}/reset/login/`, {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(formdata),
                    headers: {
                        'X-CSRFToken': csrftoken,
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                })
            }
            ret = await ret.json()
            // setAccessToken(ret.)
            console.log(ret)
            return ret
        }
        loginFunc().then((ret: { user: { username: string } }) => {
            if (ret.user) {
                localStorage.setItem('username', ret.user.username)
                dispatch(loginSlice.actions.login(ret.user.username))
            } else {
                localStorage.clear()
                alert('Login failed')
                dispatch(loginSlice.actions.login(undefined))
            }
        })
        const refreshTokenFunc: any = async () => {
            const formdata = {
                username: username,
                password: password,
            }
            const ret = await fetch(`${host}/api/token/`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(formdata),
                headers: {
                    'X-CSRFToken': csrftoken,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            const json = await ret.json()
            console.log(json)
            return json
        }
        refreshTokenFunc().then((ret: { access: string; refresh: string }) => {
            if (ret.access) {
                console.log('refresh achieved!', ret.access)
                // Seems that the auth tutorial uses localstorage
                setAccessToken(ret.access)
                localStorage.setItem('access_token', ret.access)
                setRefreshToken(ret.refresh)
                localStorage.setItem('refresh_token', ret.refresh)
            } else {
                console.log('refresh failure')
            }
        })
    }

    // useEffect(() => setUsername(login.username), [login])
    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            console.log('yeah baby', localStorage.getItem('access_token'))
        }
    }, [])

    // I need to dispatch the username so the map will be displayed
    useEffect(() => {
        if (localStorage.getItem('username')) {
            const formdata = {
                username: localStorage.getItem('username'),
                password: localStorage.getItem('password'),
            }
            // This will make the system think the user is logged in, user needs to be cleared if login failed
            dispatch(loginSlice.actions.login(formdata.username))
        }
    }, [])

    const [username, setUsername] = React.useState<string>(localStorage.getItem('username') || '')
    const [password, setPassword] = React.useState<string>('')
    const [newUser, setNewUser] = React.useState<boolean>(false)
    const [accessToken, setAccessToken] = React.useState<string>('')
    const [refreshToken, setRefreshToken] = React.useState<string>('')

    console.log('refresh is', refreshToken)

    return (
        <Box
            sx={{
                boxShadow: 3,
                borderRadius: 2,
                px: 4,
                py: 6,
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            component={'form'}
            onSubmit={handleSubmit}
        >
            <Typography component='h1' level='h4'>
                Sign in
            </Typography>
            <Grid container direction={'column'} spacing={2}>
                <Grid>
                    <Input
                        value={username}
                        placeholder='Username or email address'
                        name='username'
                        autoComplete='username'
                        autoFocus
                        onChange={(ev) => setUsername(ev.target.value)}
                    />
                </Grid>
                <Grid>
                    <Input name='password' placeholder='Password' />
                </Grid>
                <Grid sx={{ visibility: newUser ? 'visible' : 'hidden' }}>
                    <Input name='password_confirmed' placeholder='Confirmed' />
                </Grid>
                <Grid sx={{ visibility: newUser ? 'visible' : 'hidden' }}>
                    <Input name='email' placeholder='Email' />
                </Grid>
                <Grid>
                    <Grid container spacing={2}>
                        <Grid>
                            <Checkbox label='Remember me' />
                        </Grid>
                        <Grid>
                            <Checkbox
                                checked={newUser}
                                label='New User'
                                onClick={() => setNewUser(!newUser)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid>
                    <Button
                        type='submit'
                        variant='outlined'
                        sx={{ mt: 3, mb: 2 }}
                        disabled={!username}
                    >
                        Sign In
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}
