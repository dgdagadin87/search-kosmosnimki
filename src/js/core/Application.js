import "@babel/polyfill";

import Translations from 'scanex-translations';

import {
    DEFAULT_LANGUAGE,
    LOCAL_STORAGE_KEY,
    ACCESS_LAYER_ID,
    ACCESS_USER_ROLE,
    VERSION_PATH
} from '../config/constants/constants';

import RequestManager from './requestManager/RequestManager';

import DataStore from './DataStore';

import MapComponent from './map/Map';

import DrawingBridgeController from './bridgeControllers/DrawingBridgeController';
import SnapshotBridgeController from './bridgeControllers/SnapshotBridgeController';

import Events from './Events';


class Application {

    constructor(config) {

        this._config = config;

        this._events = new Events();
    }

    async start() {

        this._initRequestManager();

        this._initStore();

        this._setLocale();

        await this._loadCommonData();

        await this._initMap();

        this._initBridgeControllers();

        this._initLayersManagers();

        this._addSearchProviders();

        this._initAddons();

        this._addComponents();

        this._bindEvents();
    }

    _bindEvents() {

        const events = this.getAppEvents();

        window.addEventListener('resize', () => events.trigger('system:window:resize'));
    }

    _initRequestManager() {

        this._requestManager = new RequestManager({
            application: this
        });
    }

    _initStore() {

        const {store} = this._config;

        const dataStore = new DataStore(store);
        this._dataStore = dataStore;
        window.CatalogStore = dataStore;
    }

    _setLocale() {

        const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);  
        const viewState = JSON.parse (storedState) || {};

        Translations.setLanguage (viewState.lang || DEFAULT_LANGUAGE);
        L.gmxLocale.setLanguage(viewState.lang || DEFAULT_LANGUAGE);
    }

    async _loadCommonData() {

        await this._getUserInfo();

        await this._checkAccess();

        await this._loadVersion();
    }

    async _getUserInfo() {

        const requestManager = this.getRequestManager();

        let userInfo = {};
        try {
            const response = await requestManager.requestGetUserInfo();
            const { ID, FullName, Email, Phone, Organization } = response.Result;
            userInfo = {
                IsAuthenticated: true,
                ID: ID,
                FullName: FullName,
                Email: Email,
                Phone: Phone,
                Organization: Organization,
            };
        }
        catch(e) {
            console.log('userInfoExcept', e);
            userInfo = { IsAuthenticated: false };
        }

        const store = this.getStore();
        store.rewriteData('userInfo', userInfo);
    }

    async _checkAccess() {

        const store = this.getStore();
        const userInfo = store.getData('userInfo');

        const requestManager = this.getRequestManager();

        try {
            const response = await requestManager.requestGetLayerId({
                layerID: ACCESS_LAYER_ID
            });
            const {Status, Result = {}} = response;

            const LayerID = Result === null ? null : Result['LayerID'];

            if (Status === 'ok' && Result && LayerID === ACCESS_LAYER_ID) {
                userInfo['Role'] = ACCESS_USER_ROLE;
                store.rewriteData('userInfo', userInfo);
            }
        }
        catch(e) {
            console.log('checkAccessExcept', e);
        }
    }

    async _loadVersion() {

        const language = Translations.getLanguage();
        const versionPath = VERSION_PATH + language + '.txt';

        const response = await fetch(versionPath);

        const text = await response.text();
        
        const store = this.getStore();
        store.rewriteData('about', text);
    }

    async _initMap() {

        const mapComponent = new MapComponent({
            application: this
        });
        await mapComponent.loadMap();

        this._mapComponent = mapComponent;
    }

    _initBridgeControllers() {

        this._drawingBridgeController = new DrawingBridgeController({
            application: this,
            map: this.getMap()
        });

        this._snapshotBridgeController = new SnapshotBridgeController({
            application: this,
            map: this.getMap()
        });
    }

    _initLayersManagers() {

        this._mapComponent.initLayersManagers();
    }

    _addSearchProviders() {

        const {searchProviders = []} = this._config;

        this._searchProviders = {};

        for (let i = 0; i < searchProviders.length; i++ ) {

            const currentProvider = searchProviders[i];
            const {index, constructor} = currentProvider;

            this._searchProviders[index] = new constructor({
                application: this,
                map: this.getMap()
            });
        }
    }

    _initAddons() {

        const {addons = []} = this._config;

        this._addons = {};

        for (let i = 0; i < addons.length; i++ ) {

            const currentAddon = addons[i];
            const {index, constructor} = currentAddon;

            this._addons[index] = new constructor({
                application: this
            });
        }
    }

    _addComponents() {

        const {components = []} = this._config;

        this._components = {};

        for (let i = 0; i < components.length; i++ ) {

            const currentComponent = components[i];
            const {index, constructor} = currentComponent;

            this._components[index] = new constructor({
                application: this,
                map: this.getMap()
            });

            this._components[index].init();
        }

        const appEvents = this.getAppEvents();

        appEvents.trigger('system:components:created');
    }

    _errorHandle(e) {

        window.console.error(e);
    }

    showLoader(state = false) {

        const loaderWidget = this.getComponent('loaderIndicator');
        loaderWidget.show(state);
    }

    showNotification(message = '') {

        const notificationWidget = this.getComponent('popupNotification');
        notificationWidget.show(message);
    }

    getRequestManager() {

        return this._requestManager;
    }

    getSearchProvider(index) {

        return this._searchProviders[index];
    }

    getAddon(index) {

        return this._addons[index];
    }

    getComponent(index) {

        return this._components[index];
    }

    getStore() {

        return this._dataStore;
    }

    getMap() {

        return this._mapComponent.getMap();
    }

    getMapContainer() {

        return this._mapComponent.getMapContainer()
    }

    getMapComponent() {

        return this._mapComponent;
    }

    getAppEvents() {

        return this._events;
    }

    getBridgeController(name) {

        return this['_' + name + 'BridgeController'];
    }

}

export default Application;