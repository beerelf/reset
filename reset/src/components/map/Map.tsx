import React from 'react'
import { fromLonLat } from 'ol/proj'
import { Coordinate } from 'ol/coordinate'
import { Point } from 'ol/geom'
import 'ol/ol.css'
import './Map.css'

import { RMap, ROSM, RLayerVector, RFeature, ROverlay, RStyle } from 'rlayers'

const locationIcon = 'https://cdn.jsdelivr.net/npm/rlayers/examples/./svg/location.svg'
const INITIAL_CENTER = fromLonLat([-110.795, 45.112])

const coords: Record<string, Coordinate> = {
    origin: [2.364, 48.82],
    ArcDeTriomphe: [2.295, 48.8737],
}

export default function Map(): JSX.Element {
    return (
        <RMap className='example-map' initial={{ center: INITIAL_CENTER, zoom: 11 }}>
            <ROSM />
            <RLayerVector zIndex={10}>
                <RStyle.RStyle>
                    <RStyle.RIcon src={locationIcon} anchor={[0.5, 0.8]} />
                </RStyle.RStyle>
                <RFeature
                    geometry={new Point(fromLonLat(coords.ArcDeTriomphe))}
                    onClick={(e) => {
                        const geom = e.target.getGeometry()
                        if (geom) {
                            e.map.getView().fit(geom.getExtent(), {
                                duration: 250,
                                maxZoom: 15,
                            })
                        }
                    }}
                >
                    <ROverlay className='example-overlay'>
                        Arc de Triomphe
                        <br />
                        <em>&#11017; click to zoom</em>
                    </ROverlay>
                </RFeature>
            </RLayerVector>
        </RMap>
    )
}
