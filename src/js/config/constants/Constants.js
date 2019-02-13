const HOME_LINK = '//my.kosmosnimki.ru/Home/Settings';

const ACCESS_LAYER_ID = '9077D16CFE374967A8C57C78095F34EA';
const ACCESS_USER_ROLE = 'scanex';

const LOCAL_STORAGE_KEY = 'view_state';

const RESULT_MAX_COUNT = 1000;
const RESULT_MAX_COUNT_PLUS_ONE = 1001;

const MAX_CART_SIZE = 200;

const MAX_UPLOAD_OBJECTS = 200;
const MAX_UPLOAD_POINTS = 100000;

const VERSION = '2.2.5';
const VERSION_DATE = new Date(2018, 6, 27);

const LAYER_ID = '9B4733A8CBE942CE9F5E70DCAA6C1FBE'; // 'AFB4D363768E4C5FAC71C9B0C6F7B2F4'

const DEFAULT_LANGUAGE = 'rus';

const NON_EDIT_LINE_STYLE = {
    fill: false,
    weight: 2,
    opacity: 1
};

const TAB_SEARCH_NAME = 'search';
const TAB_RESULTS_NAME = 'results';
const TAB_FAVORITES_NAME = 'favorites';

const VERSION_PATH = 'dist/version-';

const NOTIFICATION_HIDE_TIMEOUT = 2000;

const MAP_CONTAINER_ID = 'map';

const MAP_INIT_SETTINGS = {
    center: new L.LatLng(55.634508, 37.433167),
    minZoom: 1,
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

const QUICKLOOK = {
    url: '//search.kosmosnimki.ru/QuickLookImage.ashx',
    width: 600,
    height: 600
};

const PANCHROME_IDS = [/*'WV01',*/ 'RP_PC', 'SP5_5PC', 'EROSB', 'EROSA'];

export {
    HOME_LINK,
    ACCESS_LAYER_ID,
    ACCESS_USER_ROLE,
    LOCAL_STORAGE_KEY,
    RESULT_MAX_COUNT,
    RESULT_MAX_COUNT_PLUS_ONE,
    MAX_CART_SIZE,
    MAX_UPLOAD_POINTS,
    MAX_UPLOAD_OBJECTS,
    VERSION, VERSION_DATE,
    LAYER_ID,
    DEFAULT_LANGUAGE,
    NON_EDIT_LINE_STYLE,
    VERSION_PATH,
    TAB_SEARCH_NAME,
    TAB_RESULTS_NAME,
    TAB_FAVORITES_NAME,
    NOTIFICATION_HIDE_TIMEOUT,
    MAP_CONTAINER_ID,
    MAP_INIT_SETTINGS,
    MAP_SVG_SPRITE,
    LOAD_MAP_ID,
    LOAD_MAP_PARAMS,
    EAST_HEMISPHERE,
    WEST_HEMISPHERE,
    WEST_HEMISPHERE2,
    QUICKLOOK,
    PANCHROME_IDS
};