// @ts-nocheck
import {
    Box,
    Button,
    CircularProgress,
    createTheme,
    CssBaseline,
    Grid,
    responsiveFontSizes,
    StyledEngineProvider,
    Typography,
} from '@mui/material'
import { FC, Suspense } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { ThemeProvider } from '@mui/styles'
import { ApolloProvider } from '@apollo/client'
import { client } from 'lib/apollo'

export const theme = responsiveFontSizes(
    createTheme({
        typography: {
            fontFamily: ['Roboto Condensed', 'sans-serif'].join(','),
            // subtitle1: {
            //     fontSize: 12,
            // },
            body1: {
                fontSize: 14,
                fontWeight: 400,
            },
            // button: {
            //     fontStyle: 'italic',
            // },
        },
        components: {
            MuiIconButton: {
                defaultProps: {
                    size: 'small',
                },
            },
            MuiButton: {
                defaultProps: {
                    size: 'small',
                },
            },
            MuiTextField: {
                defaultProps: {
                    size: 'small',
                },
            },
            MuiAccordionDetails: {
                defaultProps: {
                    sx: {
                        paddingRight: 0,
                    },
                },
            },
        },
        palette: {
            mode: 'light', // 'dark' or 'light'
            // if we want to add an option to have a dark mode - then we need to specify 'light' and 'dark' colors for all our palettes
            // we will also then need to go to where they're all referenced, and make them appropriately reference the mode value, ex:
            // `${theme.palette.appBarBackground.main}` ===>  `${theme.palette.appBarBackground[theme.palette.mode]}`
            primary: {
                main: '#1976d2', // default MUI color
            },
            secondary: {
                main: '#9c27b0', // default MUI color
            },
            info: {
                main: '#0288d1', // default MUI color
            },
            success: {
                main: '#2e7d32', // default MUI color
            },
            divider: 'rgba(0, 0, 0, 0.12)', // default MUI color
            error: {
                main: '#d32f2f', // default MUI color
            },
            warning: {
                main: '#eab31b',
            },
            neutral: {
                main: '#64748B',
                contrastText: '#fff',
            },
            activeTabUnderline: '#ff7b00',
            appBarBackground: {
                light: 'cornflowerblue',
                main: 'cornflowerblue',
                dark: '#121212',
            },
            white: {
                main: '#fff',
            },
            breadcrumbToolbarBackground: {
                light: '#f5f5f5',
                main: '#f5f5f5',
                dark: '#121212',
            },
            enabledGreyButton: {
                main: '#757575',
            },
            disabledGreyButton: {
                main: '#bdbdbd',
            },
            enabledBlackText: {
                light: '#212121',
                main: '#212121',
                dark: 'white',
            },
            disabledGreyText: {
                main: '#cfcfcf',
            },
            lightGreyBackground: {
                light: '#80808021',
                main: '#80808054',
            },
            chipColor: {
                light: 'lightgray',
                dark: '#898989',
            },
        },
    })
)

// to make TypeScript happy with adding additional colors to the theme:
declare module '@mui/material/styles' {
    // interface Theme {
    //   status: {
    //     danger: React.CSSProperties['color'];
    //   };
    // }

    interface Palette {
        activeTabUnderline: Palette['primary']
        appBarBackground: Palette['primary']
        white: Palette['primary']
        neutral: Palette['primary']
        breadcrumbToolbarBackground: Palette['primary']
        enabledGreyButton: Palette['primary']
        disabledGreyButton: Palette['primary']
        enabledBlackText: Palette['primary']
        disabledGreyText: Palette['primary']
        lightGreyBackground: Palette['primary']
        chipColor: Palette['primary']
    }

    interface PaletteOptions {
        activeTabUnderline: PaletteOptions['primary']
        appBarBackground: PaletteOptions['primary']
        white: PaletteOptions['primary']
        neutral: PaletteOptions['primary']
        breadcrumbToolbarBackground: PaletteOptions['primary']
        enabledGreyButton: PaletteOptions['primary']
        disabledGreyButton: PaletteOptions['primary']
        enabledBlackText: PaletteOptions['primary']
        disabledGreyText: PaletteOptions['primary']
        lightGreyBackground: PaletteOptions['primary']
        chipColor: PaletteOptions['primary']
    }

    interface PaletteColor {
        darker?: string
    }

    interface SimplePaletteColorOptions {
        darker?: string
    }

    // interface ThemeOptions {
    //   status: {
    //     danger: React.CSSProperties['color'];
    //   };
    // }
}

const ContextLoading: FC = () => {
    return (
        <Box width='100vw' height='100vh'>
            <Grid container height='100%' alignItems='center' justifyContent='center'>
                <CircularProgress />
            </Grid>
        </Box>
    )
}

const ContextFallback: FC<FallbackProps> = ({ resetErrorBoundary }) => {
    return (
        <Box width='100vw' height='100vh'>
            <Grid container height='100%' alignItems='center' justifyContent='center'>
                <div>
                    <Typography variant='h2' role='alert'>
                        Well, this wasn't in the forecast! :({' '}
                    </Typography>
                    <Button
                        onClick={() => window.location.assign(window.location.origin)}
                        sx={{
                            mt: 4,
                        }}
                    >
                        Refresh
                    </Button>
                    {process.env.NODE_ENV === 'development' ? (
                        <Button
                            onClick={() => resetErrorBoundary()}
                            sx={{
                                mt: 4,
                            }}
                        >
                            Retry
                        </Button>
                    ) : null}
                </div>
            </Grid>
        </Box>
    )
}

export const AppProvider: FC = ({ children }) => {
    return (
        <StyledEngineProvider injectFirst>
            <CssBaseline>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <ThemeProvider theme={theme}>
                        <Suspense fallback={<ContextLoading />}>
                            <ErrorBoundary FallbackComponent={ContextFallback}>
                                <ReactKeycloakProvider authClient={keycloak}>
                                    <SnackbarProvider>
                                        <ApolloProvider client={client}>
                                            <Provider store={store}>
                                                <BrowserRouter>{children}</BrowserRouter>
                                            </Provider>
                                        </ApolloProvider>
                                    </SnackbarProvider>
                                </ReactKeycloakProvider>
                            </ErrorBoundary>
                        </Suspense>
                    </ThemeProvider>
                </LocalizationProvider>
            </CssBaseline>
        </StyledEngineProvider>
    )
}
