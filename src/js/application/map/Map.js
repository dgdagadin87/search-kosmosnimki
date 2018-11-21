import  {
    MAP_CONTAINER_ID,
    MAP_INIT_SETTINGS,
    MAP_SVG_SPRITE,
    LOAD_MAP_ID,
    LOAD_MAP_PARAMS
} from '../../config/constants/constants';


export default class Map {

    constructor(config) {

        const {application} = config;

        const mapContainer = document.getElementById(MAP_CONTAINER_ID);

        const map = L.map(mapContainer, MAP_INIT_SETTINGS);

        map.options.svgSprite = MAP_SVG_SPRITE;

        this._mapContainer = mapContainer;
        this._map = map;

        this._application = application;

        this._bindEvents();
    }

    async loadMap() {

        const gmxMap = await L.gmx.loadMap(LOAD_MAP_ID, { ...LOAD_MAP_PARAMS, leafletMap: this._map });
        
        this._gmxMap = gmxMap;
                        
        this._map.invalidateSize();

        await this._initBaseLayerManager();

        this._setActiveLayer();

        this._mapControlsPrepare();
    }

    _bindEvents() {

        const application = this.getApplication();
        const globalEvents = application.getAppEvents();

        globalEvents.on('system:uiElements:created', () => this._resizeMap());
        globalEvents.on('system:uiElements:created', () => this._setMapPaggingTop());
        globalEvents.on('system:window:resize', () => this._resizeMap());
    }

    async _initBaseLayerManager() {

        this._map.gmxBaseLayersManager = new window.L.gmxBaseLayersManager(this._map);
        await this._map.gmxBaseLayersManager.initDefaults({
            srs: 3857,
            skipTiles: 'All',
            ftc: 'osm'
        });
    }

    _setActiveLayer() {

        const gmxMap = this._gmxMap;
        const baseLayers = gmxMap.properties.BaseLayers;
        const currentID = baseLayers[0];

        this._map.gmxBaseLayersManager.setActiveIDs(baseLayers).setCurrentID(currentID);
        this._map.addControl(new window.L.Control.gmxLayers(this._map.gmxBaseLayersManager, {
            hideBaseLayers: true 
        }));
    }

    _mapControlsPrepare() {

        this._map._controlCorners.searchControls = document.querySelector('#search-controls');                
        this._map._controlCorners.drawControls = document.querySelector('#draw-controls');

        this._map.gmxControlsManager.init({
            gmxHide: null,
            gmxLogo: null,
            gmxZoom: null,
            gmxDrawing: null,
            svgSprite: false,
        });
    }

    _resizeMap() {

        const bodyHeight = document.body.getBoundingClientRect().height;
        const headerHeight = document.getElementById('header').getBoundingClientRect().height;

        const heightDiff = bodyHeight - headerHeight;

        this._mapContainer.style.height = `${heightDiff}px`;
        this._map.invalidateSize();
    }

    _setMapPaggingTop() {

        const application = this.getApplication();
        const sideBarComponent = application.getUiElement('sidebar');
        const sidebarView = sideBarComponent.getView();
        const sidebarContainer = sidebarView.getContainer();

        const sidebarWidth = sidebarContainer.getBoundingClientRect().width;                
        this._map.options.paddingTopLeft = [sidebarWidth, 0];
    }

    getApplication() {

        return this._application;
    }

    getMap() {

        return this._map;
    }

    getMapContainer() {

        return this._mapContainer;
    }
}