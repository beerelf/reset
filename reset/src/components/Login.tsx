import Button from '@mui/joy/Button'
import Input from '@mui/joy/Input'
import Checkbox from '@mui/joy/Checkbox'
import Grid from '@mui/joy/Grid'
import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import React from 'react'

export default function SignIn() {
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        console.log({
            email: data.get('email'),
            password: data.get('password'),
            password_confirmed: data.get('password_confirmed'),
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
                        placeholder='Email Address'
                        name='email'
                        autoComplete='email'
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
