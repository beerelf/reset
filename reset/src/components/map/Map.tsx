import React from 'react'
import { fromLonLat } from 'ol/proj'
import { Coordinate } from 'ol/coordinate'
import { Point } from 'ol/geom'
import { buffer, containsXY, Extent, getCenter, getSize } from 'ol/extent'
import View from 'ol/View'
import Feature from 'ol/Feature'
import { createEmpty, extend, getHeight, getWidth } from 'ol/extent'
import 'ol/ol.css'
import './Map.css'

import {
    RMap,
    ROSM,
    RLayerVector,
    RFeature,
    ROverlay,
    RStyle,
    RLayerCluster,
    RLayer,
} from 'rlayers'
import GeoJSON from 'ol/format/GeoJSON'
import { useSelector } from 'react-redux'
import { ResetState } from '../../App'
import { LoginType } from '../loginSlice'

const locationIcon = 'https://cdn.jsdelivr.net/npm/rlayers/examples/./svg/location.svg'
const INITIAL_CENTER = fromLonLat([-110.795, 45.112])

const coords: Record<string, Coordinate> = {
    origin: [2.364, 48.82],
    ArcDeTriomphe: [2.295, 48.8737],
}

const reader_4326 = new GeoJSON({ featureProjection: 'EPSG:4326' })

const extentBoundary = (features: Feature[], bufferVal: number | null = null) => {
    const extent = createEmpty()
    // @ts-ignore
    for (const f of features) extend(extent, f?.getGeometry().getExtent())
    if (bufferVal) {
        return buffer(extent, bufferVal)
    }
    const estimate = 0.2 * (getWidth(extent) + getHeight(extent))
    return buffer(extent, estimate)
}

export default function Map(): JSX.Element {
    // See if I have an aoi
    const login = useSelector((state: ResetState) => state.login) as LoginType
    const aoi = login.aoi

    const [view, setView] = React.useState() as [View, Function]
    const mapRef = React.useRef() as React.RefObject<RMap>
    const olmap = mapRef.current?.ol

    React.useEffect(() => {
        const map = mapRef.current?.ol
        setView(map?.getView())
    }, [mapRef.current])

    const aoiLayer = React.useMemo(() => {
        return aoi ? (
            <RLayerVector
                zIndex={19}
                features={aoi}
                format={new GeoJSON({ featureProjection: 'EPSG:3857' })}
                opacity={0.5}
                key={Math.random()}
            >
                <RStyle.RStyle>
                    <RStyle.RStroke color='#222222' width={4} />
                    <RStyle.RFill color='transparent' />
                </RStyle.RStyle>
            </RLayerVector>
        ) : null
    }, [aoi])

    React.useEffect(() => {
        if (view && aoi) {
            view.fit(extentBoundary(aoi), {
                duration: 250,
                maxZoom: 15,
            })
        }
    }, [view, aoi])
    return (
        <RMap className='example-map' initial={{ center: INITIAL_CENTER, zoom: 11 }} ref={mapRef}>
            <ROSM />
            {aoiLayer}
        </RMap>
    )
}
