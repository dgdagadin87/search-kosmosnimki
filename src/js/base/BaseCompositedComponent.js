import BaseComponent from './BaseComponent';


export default class BaseCompositedComponent extends BaseComponent {

    constructor(props) {

        super(props);

        this._name = props['name'] || null;
    }

    getChildComponent(pathString) {

        const pathList = pathString.split('.');

        let currentComponent = this;

        for (let i = 0; i < pathList.length; i++) {

            const componentToGet = pathList[i];

            currentComponent = currentComponent['_' + componentToGet + 'Component'];
        }

        return currentComponent;
    }

    getParentComponent() {

        return this['_parent'];
    }

    initChildren(components = []) {

        const config = this.getConfig();
        const preparedConfig = {
            ...config,
            parent: this
        };

        components.forEach(component => {

            const {index, constructor, config: currentConfig = {}} = component;
            const currentPreparedConfig = {
                ...preparedConfig,
                name: index,
                currentConfig
            };
            const fullName = '_' + index + 'Component';

            this[fullName] = new constructor(currentPreparedConfig);

            this[fullName].init();
        });
    }

    isSimple() {

        return false;
    }

}