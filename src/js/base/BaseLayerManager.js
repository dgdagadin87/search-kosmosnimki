export default class BaseLayerManager {

    constructor(config) {

        const {map, application, store} = config;

        this._map = map;
        this._application = application;
        this._store = store;
    }

    getStore() {

        return this._store;
    }

    getApplication() {

        return this._application;
    }

}