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

    start() {

        this._addServices();

        this._initStore();

        this._loadLocale();
    }

    _addComponent(component) {

        //console.log(component);
    }

    _initStore() {

        const dataStore = new DataStore();
        this._dataStore = dataStore;
    }

    _loadLocale() {

        const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);  
        const viewState = JSON.parse (storedState) || {};
        Translations.setLanguage (viewState.lang || DEFAULT_LANGUAGE);
        L.gmxLocale.setLanguage(viewState.lang || DEFAULT_LANGUAGE);
    }

    _addServices() {

        const {services = []} = this._config;

        this._services = {};

        services.forEach(service => this._addService(service));
    }

    _addService(service) {

        //console.log(service);
    }

}

export default Application;