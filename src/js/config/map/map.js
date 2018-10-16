const MAP_CONTAINER_ID = 'map';

const MAP_INIT_SETTINGS = {
    center: new L.LatLng(55.634508, 37.433167),
    minZoom: 3,
    maxZoom: 17,
    zoom: 3,
    boxZoom: false,
    srs: 3857,
    skipTiles: 'All',
    ftc: 'osm',
    attributionControl: false,
    zoomControl: false,
    squareUnit: 'km2',
    distanceUnit: 'km', 
    maxBounds: L.latLngBounds(L.latLng(-100, -360), L.latLng(100, 360)),
};

const MAP_SVG_SPRITE = false;

const LOAD_MAP_ID = '1CB019F36D024831972F3029B724D7CA';

const LOAD_MAP_PARAMS = {
    apiKey: 'Z2SSNR87N4', //'A07FEB777402A559A7DE8BC6CA7C2E96',
    srs: 3857,
    skipTiles: 'All',
    ftc: 'osm',
};

export {
    MAP_CONTAINER_ID,
    MAP_INIT_SETTINGS,
    MAP_SVG_SPRITE,
    LOAD_MAP_ID,
    LOAD_MAP_PARAMS
};