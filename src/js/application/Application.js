import Translations from 'scanex-translations';

import {
    DEFAULT_LANGUAGE,
    LOCAL_STORAGE_KEY,
    ACCESS_LAYER_ID,
    ACCESS_USER_ROLE,
    VERSION_PATH
} from '../config/constants/constants';

import { isMobile } from 'js/utils/commonUtils';

import RequestManager from './requestManager/RequestManager';

import DataStore from './searchDataStore/SearchDataStore';

import MapComponent from './map/Map';

import Events from './events/Events';


class Application {

    constructor(config) {

        this._config = config;

        this._appEvents = new Events();

        this._serviceEvents = new Events();
    }

    async start() {

        this._initRequestManager();

        this._initStore();

        this._setLocale();

        await this._loadCommonData();

        await this._initMap();

        this._initBridgeControllers();

        this._initLayersManagers();

        this._initAddons();

        this._initUiElements();

        this._bindEvents();

        this._applyAddonsAfterIniting();
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

        const {bridgeControllers = []} = this._config;

        this._bridgeControllers = {};

        for (let i = 0; i < bridgeControllers.length; i++ ) {

            const currentController = bridgeControllers[i];
            const {index, constructor} = currentController;

            this._bridgeControllers[index] = new constructor({
                map: this.getMap(),
                application: this
            });
        }
    }

    _initLayersManagers() {

        const {layersManagers = []} = this._config;

        this._layersManagers = {};

        for (let i = 0; i < layersManagers.length; i++ ) {

            const currentManager = layersManagers[i];
            const {index, constructor} = currentManager;

            this._layersManagers[index] = new constructor({
                map: this.getMap(),
                application: this,
                store: this._dataStore
            });
        }
    }

    _initAddons() {

        const appEvents = this.getAppEvents();
        const {addons = []} = this._config;

        this._addons = {};

        for (let i = 0; i < addons.length; i++ ) {

            const currentAddon = addons[i];
            const {index, constructor} = currentAddon;

            this._addons[index] = new constructor({
                name: index,
                application: this
            });

            appEvents.trigger(`system:addon:${index}:created`);
        }
    }

    _initUiElements() {

        const isMobileGadget = isMobile();
        const {uiElements = []} = this._config;
        const appEvents = this.getAppEvents();

        this._uiElements = {};

        for (let i = 0; i < uiElements.length; i++ ) {

            const currentElement = uiElements[i];
            const {index, constructor, mobile = true} = currentElement;

            if ( (isMobileGadget && mobile) || !isMobileGadget) {

                this._uiElements[index] = new constructor({
                    name: index,
                    application: this,
                    map: this.getMap()
                });
    
                this._uiElements[index].init();

                appEvents.trigger(`system:ui:${index}:created`);
            }
        }

        appEvents.trigger('system:uiElements:created');
    }

    _applyAddonsAfterIniting() {

        const {_addons} = this;

        for (let addonKey in _addons) {
            const addon = _addons[addonKey];
            addon['globalApply'] && addon.globalApply();
        }
    }

    _errorHandle(e) {

        window.console.error(e);
    }

    showLoader(state = false) {

        const loaderWidget = this.getUiElement('loaderIndicator');

        loaderWidget.show(state);
    }

    showNotification(message = '') {

        const notificationWidget = this.getUiElement('popupNotificator');

        notificationWidget.show(message);
    }

    showError(errorText) {

        const errorDialog = this.getUiElement('errorDialog');

        errorDialog.show(errorText);
    }

    getRequestManager() {

        return this._requestManager;
    }

    getBridgeController(name) {

        return this._bridgeControllers[name];
    }

    getLayersManager(name) {

        return this._layersManagers[name];
    }

    getAddon(index) {

        return this._addons[index];
    }

    getUiElement(index) {

        return this._uiElements[index];
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

        return this._appEvents;
    }

    getServiceEvents() {

        return this._serviceEvents;
    }

}

export default Application;