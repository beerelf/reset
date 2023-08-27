import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import Checkbox from '@mui/joy/Checkbox'
import Grid from '@mui/joy/Grid'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import React from 'react'
import Cookies from 'cookies-js'

const csrftoken = Cookies.get('csrftoken')

export default function SignIn() {
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const formdata = {
            username: data.get('username'),
            password: data.get('password'),
            password_confirmed: data.get('password_confirmed'),
        }
        console.log(formdata, csrftoken)
        fetch('http://localhost:8000/login/', {
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
                        placeholder='Username or email address'
                        name='username'
                        autoComplete='username'
                        autoFocus
                    />
                </Grid>
                <Grid>
                    <Input name='password' placeholder='Password' />
                </Grid>
                <Grid sx={{ visibility: newUser ? 'visible' : 'hidden' }}>
                    <Input name='password_confirmed' placeholder='Confirmed' hidden={!newUser} />
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
                    <Button type='submit' variant='outlined' sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}
