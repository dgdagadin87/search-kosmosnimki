export default class BaseBridgeController {

    constructor(config) {

        const {map, application, store} = config;

        this._map = map;
        this._application = application;
        this._store = store;
    }

    getMap() {

        return this._map;
    }

    getStore() {

        return this._store;
    }

    getApplication() {

        return this._application;
    }

}