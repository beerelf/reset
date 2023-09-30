import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import Checkbox from '@mui/joy/Checkbox'
import Grid from '@mui/joy/Grid'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import React, { useEffect } from 'react'
import Cookies from 'cookies-js'
import { useDispatch, useSelector } from 'react-redux'
import { LoginType, loginSlice } from './loginSlice'

const csrftoken = Cookies.get('csrftoken')

export default function SignIn() {
    const login = useSelector((state: LoginType) => state.login)
    const dispatch = useDispatch()

    const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const asyncFunc: any = async () => {
            let ret
            const data = new FormData(event.currentTarget)
            if (newUser) {
                const formdata = {
                    username: data.get('username'),
                    password: data.get('password'),
                    password_confirmed: data.get('password_confirmed'),
                    email: data.get('email'),
                }
                console.log(formdata, csrftoken)
                ret = await fetch('http://localhost:8000/reset/newuser/', {
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
                console.log(formdata, csrftoken)
                ret = await fetch('http://localhost:8000/reset/login/', {
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
            console.log('returning', ret)
            return ret
        }
        asyncFunc().then((ret: { user: { username: String } }) => {
            console.log('res', ret.user.username)
            dispatch(loginSlice.actions.login(ret.user.username))
        })
    }

    useEffect(() => {
        setUsername(login.username)
    }, [login])

    const [username, setUsername] = React.useState('')
    const [newUser, setNewUser] = React.useState<boolean>(false)

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
