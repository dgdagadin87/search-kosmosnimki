import Events from '../core/Events';


export default class BaseComponent {

    constructor(config = {}) {

        this.events = new Events();

        this._application = config['application'];
        this._map = config['map'];
    }

    getMap() {

        return this._map;
    }

    getApplication() {

        return this._application;
    }

}