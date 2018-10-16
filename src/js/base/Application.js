import "@babel/polyfill";

import Translations from 'scanex-translations';

import {
    DEFAULT_LANGUAGE,
    LOCAL_STORAGE_KEY
} from '../config/constants/constants';

import DataStore from './DataStore';


class Application {

    constructor(config) {

        this._config = config;
    }

    async start() {

        this._addServices();

        this._initStore();

        this._setLocale();

        await this._loadCommonData();

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

    async _loadCommonData() {

        const catalogService = this.getService('catalogServer');

        try {
            const userData = await catalogService.getUserInfo();
            console.log(userData);
        }
        catch(e) {
            console.log('userInfoExcept', e);
            const store = this.getStore();
            store.setConstantData('userInfo', { IsAuthenticated: false });
        }
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

    _errorHandle(e) {

        window.console.error(e);
    }

    getService(index) {

        return this._services[index];
    }

    getStore() {

        return this._dataStore;
    }

}

export default Application;