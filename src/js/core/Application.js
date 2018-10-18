import "@babel/polyfill";

import Translations from 'scanex-translations';

import {
    DEFAULT_LANGUAGE,
    LOCAL_STORAGE_KEY,
    ACCESS_LAYER_ID,
    ACCESS_USER_ROLE,
    VERSION_PATH
} from '../config/constants/constants';

import DataStore from './DataStore';

import MapComponent from '../map/Map';

import Events from './Events';


class Application {

    constructor(config) {

        this._config = config;

        this._events = new Events();
    }

    async start() {

        this._addServices();

        this._initStore();

        this._setLocale();

        await this._loadCommonData();

        await this._initMap();

        this._addComponents();

    }

    _initStore() {

        const {store} = this._config;

        const dataStore = new DataStore(store);
        this._dataStore = dataStore;
    }

    _setLocale() {

        const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);  
        const viewState = JSON.parse (storedState) || {};
        Translations.setLanguage (viewState.lang || DEFAULT_LANGUAGE);
        L.gmxLocale.setLanguage(viewState.lang || DEFAULT_LANGUAGE);
    }

    _addServices() {

        const {services = []} = this._config;

        this._services = {};

        for (let i = 0; i < services.length; i++ ) {

            const currentService = services[i];
            const {index, constructor} = currentService;

            this._services[index] = new constructor({
                application: this
            });
        }
    }

    async _loadCommonData() {

        await this._getUserInfo();

        await this._checkAccess();

        await this._loadVersion();
    }

    async _getUserInfo() {

        const catalogService = this.getService('catalogServer');

        let userInfo = {};
        try {
            const response = await catalogService.getUserInfo();
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
        store.setConstantableData('userInfo', userInfo);
    }

    async _checkAccess() {

        const store = this.getStore();
        const userInfo = store.getConstantableData('userInfo');

        const gmxService = this.getService('gmxServer');

        try {
            const response = await gmxService.getLayerId({
                layerID: ACCESS_LAYER_ID
            });
            const {Status, Result = {}} = response;
            const {LayerID} = Result;

            if (Status === 'ok' && Result && LayerID === ACCESS_LAYER_ID) {
                userInfo['Role'] = ACCESS_USER_ROLE;
                store.setConstantableData('userInfo', userInfo);
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
        store.setConstantableData('about', text);
    }

    async _initMap() {

        const mapComponent = new MapComponent({
            application: this
        });
        await mapComponent.loadMap();

        this._mapComponent = mapComponent;
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
    }

    _errorHandle(e) {

        window.console.error(e);
    }

    getService(index) {

        return this._services[index];
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

}

export default Application;