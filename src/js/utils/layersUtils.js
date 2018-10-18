import Translations from 'scanex-translations';

import {flatten} from './commonUtils';


const EAST_HEMISPHERE = L.bounds(
    L.point(0, -90), 
    L.point(180, 90)
);

const WEST_HEMISPHERE = L.bounds(
    L.point(180, -90),
    L.point(360, 90)
);

const WEST_HEMISPHERE2 = L.bounds(
    L.point(-180, -90),
    L.point(0, 90)
);

function getDrawingObject (rawObject) {

    const { id, name, geoJSON, color, visible } = rawObject;

    const correctId = id || L.gmxUtil.newId();
    const correctName = (name === null || typeof name === 'undefined') ? getDrawingObjectName(geoJSON) : decodeURIComponent(name);
    const GeoJSON = {
        type: 'Feature',
        geometry: L.gmxUtil.geometryToGeoJSON(geoJSON.geometry),
        properties: geoJSON.properties
    };
    const isVisible = typeof visible === 'undefined' ? true : Boolean(visible);
    const isEditable = typeof geoJSON.properties.editable === 'undefined' ? true : geoJSON.properties.editable;

    let correctColor;
    if (geoJSON.geometry.type === 'Point') {
        correctColor = undefined;
    }
    else {
        if (typeof color === 'undefined') {
            correctColor = '#0033FF';
        }
        else {
            if (isNaN (parseInt(color, 10))) {
                correctColor = color;
            }
            else {
                correctColor = `#${hex(color)}`;
            }
        }
    }

    return {
        id: correctId,
        name: correctName,
        area: getDrawingObjectArea(geoJSON),            
        geoJSON:  GeoJSON,
        visible: isVisible,
        color: correctColor,
        editable: isEditable
    };
}

function getDrawingObjectArea(geoJSON) {

    const {geometry: {type,coordinates}} = geoJSON;

    if (typeof coordinates !== 'undefined') {

        switch (type.toUpperCase()) {
            case 'POINT':
                return 0;
            case 'LINESTRING':
            case 'MULTILINESTRING':
                return L.gmxUtil.geoJSONGetLength(geoJSON);
            case 'MULTIPOLYGON':
            case 'POLYGON':
            default:
                return L.gmxUtil.geoJSONGetArea(geoJSON);
        }
    }
}

function getDrawingObjectName(geoJSON) {

    if(geoJSON.properties.name) {
        return geoJSON.properties.name;
    }
    else {
        const type = geoJSON.geometry.type;

        switch (type.toUpperCase()) {
            case 'POINT':
                return Translations.getText('objects.point');
            case 'LINESTRING':
            case 'MULTILINESTRING':
                return Translations.getText('objects.line');
            case 'MULTIPOLYGON':
            case 'POLYGON':
            default:
                return Translations.getText('objects.polygon');
        }         
    }
}

function splitOn180 (geometry) {

    const {type, coordinates} = geometry;

    const splitCoordinates = (points, hemisphere) => {

        let coords = L.PolyUtil.clipPolygon(points, hemisphere).map(({x,y}) => [x,y]);
        if (coords.length > 0) {
            let start_point = coords[0];
            let end_point = coords[coords.length - 1];
            if (start_point[0] != end_point[0] || start_point[1] != end_point[1]) {
                coords.push(start_point);
            }
        }
        return coords;
    };

    let geometries = [];

    switch(type.toUpperCase()) {
        case 'POLYGON':
            const points = coordinates[0].map(([x,y]) => L.point(x,y));
            let c1 =  splitCoordinates(points, EAST_HEMISPHERE);
            if (c1.length > 0) {
                geometries.push(normalizeGeometry ({type, coordinates: [c1]}, 179));
            }            
            let c2 = splitCoordinates(points, WEST_HEMISPHERE);
            if (c2.length > 0) {
                geometries.push(normalizeGeometry ({type, coordinates: [c2]}, -179));
            }
            else {
                c2 = splitCoordinates(points, WEST_HEMISPHERE2);
                if (c2.length > 0) {
                    geometries.push(normalizeGeometry ({type, coordinates: [c2]}, -179));
                }
            }
            break;
        case 'LINESTRING':            
        default:
            geometries.push(geometry);
            break;
    }
    return geometries;
}

function normalizeGeometry (geometry, lng) {

    let {type, coordinates} = geometry;

    const x = isNumber(lng) ? lng : getRefLon(coordinates);

    switch (type.toUpperCase()) {
        case 'POLYGON':
            return {type, coordinates: normalizePolygon(x, coordinates)};
        case 'MULTIPOLYGON':
            return {type, coordinates: coordinates.map(normalize_polygon.bind(null, x))};
        default:
            return geometry;
    }
}

function normalizePoint (lng, [x,y]) {
    return [make_close_to(lng, x),y];
}

function normalizeRing (lng, coordinates) {
    return coordinates.map(normalizePoint.bind(null, lng));
}

function normalizePolygon (lng, coordinates) {
    if (isNumber (lng)) {
        return coordinates.map(normalizeRing.bind(null, lng));
    }
    else {
        return coordinates.map(normalizeRing.bind(null, getRefLon(coordinates)));
    }
}

function getRefLon (coordinates) {

    let f = flatten(coordinates);
    let pos = f.filter(([x,y]) => x >= 0);
    let [x,y] = pos.length > 0 ? pos[0] : f[0];
    return x;    
}

export {
    getDrawingObject,
    splitOn180
};