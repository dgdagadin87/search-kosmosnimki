import Translations from 'scanex-translations';


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

export {
    getDrawingObject
};