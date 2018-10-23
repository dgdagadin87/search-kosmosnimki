import Events from '../core/Events';

import BaseComponent from './BaseComponent';


export default class BaseCompositedComponent extends BaseComponent {

    constructor(props) {

        super(props);

        this._name = props['name'] || null;
    }

    getChildComponent(componentName) {

        return this['_' + componentName + 'Component'];
    }

    getParentComponent() {

        return this['_parent'];
    }

    isSimple() {

        return false;
    }

}