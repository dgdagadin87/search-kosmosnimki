export default class BaseSearchProvider {

    constructor(config = {}) {

        this._application = config['application'];
        this._map = config['map'];

        this._provider = null;
    }

    getMap() {

        return this._map;
    }

    getApplication() {

        return this._application;
    }

    getMain() {

        return this._provider;
    }

}