import Events from './Events';


export default class DataStore {

    constructor(config = {}) {

        this._data = {
            'constantable': [],
            'changeable': []
        };

        this._events = new Events();

        this._applyConfig(config);
    }

    _applyConfig(config) {

        const {name, constantable, changeable} = config;

        this._setName(name);

        this._createConstantable(constantable);

        this._createChangeable(changeable);
    }

    _setName(name) {

        this._name = name;
    }

    _createConstantable(constantable = []) {

        constantable.forEach(key => this._setConstantableSegment(key));
    }

    _createConstantableSegment(key) {

        this._data['constantable'][key] = {};
    }

    _createChangeable(changeable = []) {

        changeable.forEach(key => this._createChangeableSegment(key));
    }

    _createChangeableSegment(key) {

        this._data['changeable'][key] = {};
    }

    getConstantableData(key) {

        const {constantable} = this._data;
        const keyData = constantable[key] || {};

        return keyData;
    }

    setConstantableData(key, data) {
        
        this._data['constantable'][key] = data;
    }

    getChangeableData(key, options = {}) {

        const {changeable} = this._data;
        const keyData = changeable[key] || {};

        return keyData;
    }

    setChangeableData(key, data, options = {}) {

        const changeEventName = `${key}:change`;

        this._data['constantable'][key] = data;

        this._events.trigger(changeEventName);
    }

    on(...argList) {

        this._events.on(...argList);
    }

}