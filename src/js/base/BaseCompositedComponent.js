import Events from '../core/Events';


export default class BaseCompositedComponent {

    constructor(config = {}) {

        this.events = new Events();

        this._application = config['application'];
        this._map = config['map'];

        this._parent = config['parent'];

        this._props = config;
    }

    getMap() {

        return this._map;
    }

    getApplication() {

        return this._application;
    }

    getChildComponent(componentName) {

        return this['_' + componentName + 'Component'];
    }

    getParentComponent() {

        return this['_parent'];
    }

    getProps() {

        return this._props;
    }

}