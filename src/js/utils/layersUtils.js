import Translations from 'scanex-translations';

import {flatten, isNumber, makeCloseTo} from './commonUtils';


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

function isGeometry(obj) {

    const {type} = obj;

    switch (type) {
        case 'Point':
        case 'MultiPoint':
        case 'LineString':
        case 'MultiLineString':
        case 'Polygon':
        case 'MultiPolygon':
        case 'GeometryCollection':
            return true;
        default:
            return false;
    }    
}

function isGeojsonFeature (obj) {

    let {type, geometry, properties} = obj;
    if(type !== 'Feature') {
        console.log('geojson feature test failed: provided type is not a "Feature" object', obj);
        return false;
    }
    if(!isGeometry(geometry)) {
        console.log('geojson feature test failed: geometry is of wrong type', geometry);
        return false;
    }
    return true;
}

function normalizeGeometry (geometry, lng) {

    let {type, coordinates} = geometry;

    const x = isNumber(lng) ? lng : getRefLon(coordinates);

    switch (type.toUpperCase()) {
        case 'POLYGON':
            return {type, coordinates: normalizePolygon(x, coordinates)};
        case 'MULTIPOLYGON':
            return {type, coordinates: coordinates.map(normalizePolygon.bind(null, x))};
        default:
            return geometry;
    }
}

function normalizePoint (lng, [x,y]) {
    return [makeCloseTo(lng, x),y];
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

function getBbox (geometry) {
    let {type, coordinates} = geometry;
    let lon = 0, lat = 0;
    let sorter = (a,b)=> {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }            
        return 0;
    };
    let rings = coords => {
        let {xs, ys} = coords.reduce((a, [x, y]) => {        
            a.xs.push (x);
            a.ys.push (y);
            return a;
        }, {xs:[],ys:[]});        
        xs = xs.sort(sorter);
        ys = ys.sort(sorter);
        let xmin = xs[0];
        let xmax = xs[xs.length - 1];
        let ymin = ys[0];
        let ymax = ys[ys.length - 1];
        return [[xmin,ymax],[xmax,ymax],[xmax,ymin],[xmin,ymin]];
    };
    switch (type.toUpperCase()) {
        case 'POINT':
            [lon, lat] = coordinates;
            return [[lon,lat],[lon,lat],[lon,lat],[lon,lat]];
        case 'MULTIPOINT':
        case 'LINESTRING':
            return rings (coordinates);
        case 'POLYGON':
        case 'MULTILINESTRING':
            return rings (coordinates[0]);        
        case 'MULTIPOLYGON':
            let {xs, ys} = coordinates.reduce ((a, coords) => {
                let [[x1,y1],[x2,y2],[x3,y3],[x4,y4]] = rings (coords[0]);
                a.xs.push (x1);
                a.xs.push (x2);
                a.xs.push (x3);
                a.xs.push (x4);
                a.ys.push (y1);
                a.ys.push (y2);
                a.ys.push (y3);
                a.ys.push (y4);
                return a;
            }, {xs: [], ys: []});
            xs = xs.sort(sorter);
            ys = ys.sort(sorter);
            let xmin = xs[0];
            let xmax = xs[xs.length - 1];
            let ymin = ys[0];
            let ymax = ys[ys.length - 1];
            return [[xmin,ymax],[xmax,ymax],[xmax,ymin],[xmin,ymin]];                        
        default:
            return null;
    }
}

function sti (period, lon, lat) {
    return 65536 * period + 256 * Math.round(256 * (90 - lat) / 180) + Math.round(256 * (lon + 180) / 360);
}

function step  (lat) {
    return lat < 50 ? 1 : (50 <= lat && lat <= 70 ? 2 : 3);
}

function tileRange (period, [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]) {        
    
    let nw = sti (period, x1, y1) - (step (Math.abs(y1)) + 512);
    let ne = sti (period, x2, y2) + (step (Math.abs(y2)) - 512);
    let se = sti (period, x3, y3) + (step (Math.abs(y3)) + 512);
    let sw = sti (period, x4, y4) - (step (Math.abs(y4)) - 512);

    let rng = [];    
    for (let lo = nw, hi = ne; hi <= se; lo += 256, hi += 256) {
        let k = lo;
        while (k <= hi) {
            rng.push(k++);
        }        
    }
    return rng;
}

export {
    getDrawingObject,
    getDrawingObjectArea,
    splitOn180,
    normalizeGeometry,
    isGeojsonFeature,
    isGeometry,
    getBbox,
    tileRange
};