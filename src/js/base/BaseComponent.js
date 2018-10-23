import Events from '../core/Events';


export default class BaseComponent {

    constructor(config = {}) {

        this.events = new Events();

        this._props = config;

        this._application = config['application'];
        this._map = config['map'];

        this._parent = config['parent'];
    }

    getMap() {

        return this._map;
    }

    getApplication() {

        return this._application;
    }

    getParentComponent() {

        return this['_parent'];
    }

    getConfig() {

        return this._props;
    }

    isSimple() {

        return true;
    }

    getView() {

        return this._view;
    }

}