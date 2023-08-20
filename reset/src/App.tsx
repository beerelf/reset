import * as React from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import GlobalStyles from '@mui/joy/GlobalStyles'
import CssBaseline from '@mui/joy/CssBaseline'
import Box from '@mui/joy/Box'
import useScript from './useScript'
import FirstSidebar from './components/FirstSidebar'
import SecondSidebar from './components/SecondSidebar'
import Header from './components/Header'
import ColorSchemeToggle from './components/ColorSchemeToggle'
import Map from './components/map/Map'
import SignIn from './components/Login'
import { useSelector } from 'react-redux'

const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

type ResetState = {
    login: {
        user: string
    }
}

export default function JoyOrderDashboardTemplate() {
    const status = useScript(`https://unpkg.com/feather-icons`)

    useEnhancedEffect(() => {
        // Feather icon setup: https://github.com/feathericons/feather#4-replace
        // @ts-ignore
        if (typeof feather !== 'undefined') {
            // @ts-ignore
            feather.replace()
        }
    }, [status])

    // Add some redux stuff
    const login = useSelector((state: ResetState) => state.login.user)
    console.log('login', login)

    const showContent = login ? <Map /> : <SignIn />

    return (
        <CssVarsProvider disableTransitionOnChange>
            <GlobalStyles
                styles={(theme) => ({
                    '[data-feather], .feather': {
                        color: `var(--Icon-color, ${theme.vars.palette.text.icon})`,
                        margin: 'var(--Icon-margin)',
                        fontSize: `var(--Icon-fontSize, ${theme.vars.fontSize.xl})`,
                        width: '1em',
                        height: '1em',
                    },
                })}
            />
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
                {/* only get header when size is sm */}
                <Header />
                <FirstSidebar />
                <SecondSidebar />
                {/* this is the header otherwise */}
                <Box
                    component='main'
                    className='MainContent'
                    sx={(theme) => ({
                        // padding vertical, top, bottom
                        px: {
                            xs: 0,
                            md: 0,
                            lg: 0,
                        },
                        pt: {
                            xs: `calc(${theme.spacing(2)} + var(--Header-height))`,
                            sm: `calc(${theme.spacing(2)} + var(--Header-height))`,
                            md: 3,
                        },
                        pb: {
                            xs: 2,
                            sm: 2,
                            md: 3,
                        },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        height: '100dvh',
                        gap: 1,
                    })}
                >
                    {/* this should be the header */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid lightgray',
                        }}
                    >
                        <Box>I am the coolest header</Box>
                        <ColorSchemeToggle
                            sx={{ ml: 'auto', display: { xs: 'none', md: 'inline-flex' } }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            my: 1,
                            gap: 1,
                            flexWrap: 'wrap',
                            '& > *': {
                                minWidth: 'clamp(0px, (500px - 100%) * 999, 100%)',
                                flexGrow: 1,
                            },
                        }}
                    >
                        {showContent}
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    )
}
