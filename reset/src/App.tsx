import * as React from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import GlobalStyles from '@mui/joy/GlobalStyles'
import CssBaseline from '@mui/joy/CssBaseline'
import Box from '@mui/joy/Box'
import useScript from './useScript'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ColorSchemeToggle from './components/ColorSchemeToggle'
import Map from './components/map/Map'
import SignIn from './components/Login'
import { useDispatch, useSelector } from 'react-redux'
import loginReducer, { LoginType, loginSlice } from './components/loginSlice'

import { UserType } from './components/authActions'
import { Button } from '@mui/joy'
import { Feature } from 'ol'
import GeoJSON from 'ol/format/GeoJSON'

const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

export type ResetState = {
    login: LoginType
    user: UserType
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
    const dispatch = useDispatch()
    const login = useSelector((state: ResetState) => state.login) as LoginType

    const [fileList, setFileList] = React.useState<FileList | null>()

    const onChangeImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files
        console.log(f)
        setFileList(e.target.files)
    }

    const doImport = () => {
        const async_bullshit = async () => {
            if (fileList) {
                // Create an object of formData
                const formData = new FormData()

                // Update the formData object
                for (var i = 0; i < fileList.length; i++) {
                    formData.append('file_uploaded', fileList[i])
                }
                // This works in the drf tester at http://localhost:8000/reset/upload/ but I get a bad request here.
                const log_ret = await fetch('http://localhost:8000/reset/upload/', {
                    method: 'POST',
                    // headers: { 'Content-Type': 'multipart/form-data' },
                    body: formData,
                })
                // This does delay until the import is finished appropriately.
                return log_ret
            }
        }
        const ret: any = async_bullshit()
            .then((f) => f?.json())
            .then((f) => {
                // convert aoi to a feature
                const geojson = new GeoJSON()
                const feats = geojson.readFeatures(f.aoi)
                // @ts-ignore
                feats.forEach((f) => f.getGeometry().transform('EPSG:4326', 'EPSG:3857'))

                dispatch(loginSlice.actions.setaoi(feats))
            })
    }

    const showContent = login?.username ? (
        <>
            <Map />
            <div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type='file'
                        accept='.dbf, .shp, .prj, .shx, .kml, .geojson'
                        onChange={onChangeImportFile}
                        multiple
                    />
                </div>
                {fileList ? <Button onClick={doImport}>Import</Button> : null}
            </div>
        </>
    ) : (
        <SignIn />
    )

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
                <Sidebar />
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
