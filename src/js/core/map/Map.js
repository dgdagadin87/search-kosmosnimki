import  {
    MAP_CONTAINER_ID,
    MAP_INIT_SETTINGS,
    MAP_SVG_SPRITE,
    LOAD_MAP_ID,
    LOAD_MAP_PARAMS
} from '../../config/map/Map';

import DrawingLayerManager from './layersManagers/DrawingsLayerManager';
import SnapshotLayerManager from './layersManagers/SnapshotsLayerManager';


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
    }

    initLayersManagers() {

        this._drawingLayerManager = new DrawingLayerManager({
            map: this._map,
            application: this.getApplication(),
            store: this.getApplication().getStore()
        });

        this._snapshotLayerManager = new SnapshotLayerManager({
            map: this._map,
            application: this.getApplication(),
            store: this.getApplication().getStore()
        });
    }

    _bindEvents() {

        const application = this.getApplication();
        const globalEvents = application.getAppEvents();

        globalEvents.on('system:components:created', () => this._resizeMap());
        globalEvents.on('system:components:created', () => this._setMapPaggingTop());
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

    _resizeMap() {

        const bodyHeight = document.body.getBoundingClientRect().height;
        const headerHeight = document.getElementById('header').getBoundingClientRect().height;

        const heightDiff = bodyHeight - headerHeight;

        this._mapContainer.style.height = `${heightDiff}px`;
        this._map.invalidateSize();
    }

    _setMapPaggingTop() {

        const application = this.getApplication();
        const sideBarComponent = application.getComponent('sidebar');
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