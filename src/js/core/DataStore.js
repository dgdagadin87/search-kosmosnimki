export default class DataStore {

    constructor(config = {}) {

        this._data = {
            'constant': [],
            'dynamic': []
        };

        this._applyConfig(config);
    }

    _applyConfig(config) {

        const {name, constant, dynamic} = config;

        this._setName(name);

        this._setConstant(constant);

    }

    _setName(name) {

        this._name = name;
    }

    _setConstant(constant = []) {

        constant.forEach(key => this._setConstantSegment(key));
    }

    _setConstantSegment(key) {

        this._data['constant'][key] = {};
    }

    getConstantData(key) {

        const {constant} = this._data;
        const keyData = constant[key] || {};

        return keyData;
    }

    setConstantData(key, data) {
        
        this._data['constant'][key] = data;
    }

}