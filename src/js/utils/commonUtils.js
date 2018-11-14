import Translations from 'scanex-translations';

import {
    LAYER_ATTRIBUTES,
    LAYER_ATTR_TYPES,
    EAST_HEMISPHERE,
    WEST_HEMISPHERE,
    WEST_HEMISPHERE2
} from '../config/constants/constants';
import { satellites } from '../config/satellites/satellites';


function isNumber(n) {

    return !isNaN (new Number(n));
}

function createContainer () {

    const container = document.createElement('div');
    document.body.appendChild(container);
    return container;
}

function getWindowCenter () {

    const {left, top, width, height} = document.body.getBoundingClientRect();
    return {left: left + Math.round (width / 2), top: top + Math.round(height / 2)};
}

function getMapCenter () {

    const headerBounds = document.getElementById('header').getBoundingClientRect();
    const {top, left} = getWindowCenter ();
    return {top: top + headerBounds.top + headerBounds.height, left};
}

function isMobile () {

    let browserCheckString = navigator.userAgent || navigator.vendor || window.opera;
    let stringSubstr = browserCheckString.substr(0,4);

    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(browserCheckString) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(stringSubstr);
}

function _f (arr, acc, swap) {
    if (arr.length) {
        let r = [];
        for (let i = 0, len = arr.length; i < len; i++) {
            let a = arr[i];
            if (_f(a, acc, swap)) {
                if (swap) {
                    r.unshift(a);
                }
                else {
                    r.push(a);
                }
            }
        }
        if (r.length) {
            acc.push(r);
        }
        return false;
    }
    else {
        return true;
    }
}

function flatten (arr, swap) {
    let acc = [];
    _f(arr, acc, swap);
    return acc;
}

function getTotalHeight (parts) {
    return parts.reduce((a, x) => a + document.body.querySelector(x).getBoundingClientRect().height, 0);
};

function uppercaseFirstLetter(stringValue) {

    if (typeof stringValue !== 'string') return ''
    return stringValue.charAt(0).toUpperCase() + stringValue.slice(1)
}

function makeCloseTo (lng, x) {
    let dist = (a,b) => Math.abs (a - b);
    let {p} = [x - 360, x, x + 360]
    .map(p => {
        return {p, d: dist (lng, p)};
    })
    .reduce((a,{p,d}) => {
        if (a === null || d < a.d) {
            a = {d, p};
        }
        return a;
    }, null);
    return p;
}

function stRange (start, end, boxes) {            
    let rng = [];
    let lo = getQuarters (start);
    let hi = getQuarters (end);
    for (let i = lo; i <= hi; i++) {
        boxes.forEach (box => {
            tileRange (i, box).forEach (n => rng.push(n));
        });        
    }
    return rng;
}

function toQuery (range) {    
    return `${range.length > 0 ? `stidx IN (${range.join(',')})` : '' }`;
}

function getQuarters (date) {
    return (date.getFullYear() - 1970) * 4 + Math.ceil ((date.getMonth() + 1) / 3);
}

function getCorrectIndex(index) {

    return LAYER_ATTRIBUTES.indexOf(index) + 1;
}

function propertiesToItem(properties) {

    if (!properties) {
        return null;
    }

    const lastPropertyIndex = properties ? properties.length - 1 : 0;

    return properties.slice(1, lastPropertyIndex).reduce((propertyObject, value, index) => {
        
        let attrKey = LAYER_ATTRIBUTES[index];
        
        switch (LAYER_ATTR_TYPES[index]){
            case 'date':
                if (typeof value === 'string') {
                    propertyObject[attrKey] = new Date(value);
                }
                else if (typeof value === 'number') {
                    propertyObject[attrKey] = new Date(value * 1000);
                }
                break;                
            default:
                propertyObject[attrKey] = value;
                break;
        }           
        return propertyObject;
    },{});
}

function getSatelliteName (platform) {

    const getName = (a, x) => {    
        return x.platforms.reduce((b, y) => {
            b[y] = x.name;
            return b;
        }, a);
    };

    let names = satellites.ms.reduce(getName, {});
    names = satellites.pc.reduce(getName, names);

    return names[platform];
}

function getPanelHeight (container, parts) {

    return parts.reduce((a,x) => {
        return a - container.querySelector(x).getBoundingClientRect().height;
    }, container.getBoundingClientRect().height);
}

function getVisibleChangedState(show, properties) {

    const visibleIndex = getCorrectIndex('visible');
    const visibleValue = properties[visibleIndex];

    let changed = false;

    if (show) {
        switch(visibleValue) {
            case 'hidden':
            case 'failed':
                properties[visibleIndex] = 'loading';
                changed = true;
                break;
            case 'loading':                
                properties[visibleIndex] = 'visible';
                changed = true;
                break;
            case 'visible':
            default:
                break;
        }
    }
    else {
        switch(properties[visibleIndex]) {
            case 'failed':
            case 'loading':
            case 'visible':
                properties[visibleIndex] = 'hidden';
                changed = true;
                break;
            case 'hidden':
            default:
                break;
        }
    }

    return changed;
}

function splitComplexId (complexId) {

    let separatorIndex = complexId.lastIndexOf('!');
    return separatorIndex > 0
        ? { id: complexId.substring(0, separatorIndex),
            productId: complexId.substring(separatorIndex + 1, complexId.length)
        }
        : { id: complexId };
}

function fromGmx ({fields, values, types}, convertMercator = true) {

    return values.map(x => {
        let item = fields.reduce((a, k, i) => {
            switch(types[i]){
                default:                    
                    a[k] = x[i];
                    break;                   
                case 'date':
                    switch (typeof x[i]) {
                        case 'string':
                            a[k] = new Date(x[i]);
                            break;
                        case 'number':
                            a[k] = new Date(x[i] * 1000);
                            break;
                        default:
                            break;
                    }                    
                    break;
                case 'time':
                    break;
                case 'geometry':
                    a[k] = L.gmxUtil.geometryToGeoJSON(x[i], convertMercator);
                    break;
            }
            switch (k) {
                case 'stereo':
                    const s = x[i];
                    a.stereo = typeof s === 'string' && s !== 'NONE';
                    break;                    
                default:
                    break;
            }
            return a;                    
        }, {});
        if (item.geomixergeojson) {
            item.geoJSON = item.geomixergeojson;
            delete item.geomixergeojson;
        }        
        item.url = `//search.kosmosnimki.ru/QuickLookImage.ashx?id=${item.sceneid}`;
        return item;
    });    
}

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

    let {type, geometry} = obj;

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

function getShapefileObject(item, key) {

    const drawingObject = getDrawingObject ({geoJSON: item});
    const {name, color, editable, visible, geoJSON: {geometry, properties}} = drawingObject;
    const itemId = '_item' + key;

    return Object.assign(
        {},
        {
            selectedName: name,
            itemId,
            name,
            color,
            editable,
            visible
        },
        {geoJSON: {geometry, properties}}
    );
}

function getCoordinatesCount(results) {

    let numOfCoordinates = 0;

    const recursiveArrayLength = data => {

        for (let i = 0; i < data.length; i++) {

            const currentArray = data[i];

            if (currentArray instanceof Array) {
                recursiveArrayLength(currentArray);
            }
            else {
                numOfCoordinates++;
            }
        }
    };

    for (let i = 0; i < results.length; i++) {

        const currentItem = results[i];
        const {geometry: {coordinates = []}} = currentItem;

        recursiveArrayLength(coordinates);
    }

    numOfCoordinates = Math.round(numOfCoordinates / 2);

    return numOfCoordinates;
}

export {
    isNumber,
    createContainer,
    getWindowCenter,
    getMapCenter,
    isMobile,
    flatten,
    getTotalHeight,
    uppercaseFirstLetter,
    makeCloseTo,
    stRange,
    toQuery,
    getQuarters,
    getCorrectIndex,
    propertiesToItem,
    getSatelliteName,
    getPanelHeight,
    getVisibleChangedState,
    splitComplexId,
    fromGmx,
    getDrawingObject,
    getDrawingObjectArea,
    splitOn180,
    normalizeGeometry,
    isGeojsonFeature,
    isGeometry,
    getBbox,
    tileRange,
    getShapefileObject,
    getCoordinatesCount
};