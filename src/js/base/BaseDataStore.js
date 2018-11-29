import Events from '../application/events/Events';


export default class DataStore {

    constructor(config = {}) {

        this._data = [];

        this._events = new Events();

        this._applyConfig(config);
    }

    _applyConfig(config) {

        const {name, data} = config;

        this._setName(name);

        this._createConainers(data);
    }

    _setName(name) {

        this._name = name;
    }

    _createConainers(changeable = []) {

        changeable.forEach(item => this._createContainer(item));
    }

    _createContainer(item) {

        const {key, isTable = false, defaultValue = null, indexBy = ''} = item;
        const defaultData = defaultValue ? defaultValue : (isTable ? {} : null);

        this._data[key] = {
            data: defaultData,
            config:{
                indexBy,
                isTable
            }
        };
    }

    _fireEvents(events = [], rowIds = []) {

        events.forEach(eventName => this._events.trigger(eventName, rowIds));
    }

    getData(key, rowId = false) {

        const keySegment = this._data[key] || {};
        const {data} = keySegment;

        if (!rowId) {
            return data;
        }
        else {
            return data[rowId];
        }
    }

    getSerializedData(key) {

        const keySegment = this._data[key] || {};
        const {data, config:{isTable}} = keySegment;

        if (!isTable) {
            return data;
        }
        else {
            return Object.keys(data).map(id => data[id]);
        }
    }

    addData(key, data = [], events = []) {

        const currentSegment = this._data[key] || {};
        const {data: prevData} = currentSegment;

        let options;

        if (Array.isArray(data)) {

            options = [];

            data.forEach(dataItem => {
                const {id, content} = dataItem;
                prevData[id] = content;
                options.push(id);
            });
    
            this._data[key]['data'] = prevData;
        }
        else {

            const {id, content} = data;
            prevData[id] = content;
            options = id;
        }

        this._fireEvents(events, options);
    }

    updateData(key, data = [], events = []) {
        
        const currentSegment = this._data[key] || {};
        const {data: prevData} = currentSegment;

        let options;

        if (Array.isArray(data)) {

            options = [];

            data.forEach(dataItem => {
                const {id, content} = dataItem;
                prevData[id] = content;
                options.push(id);
            });
    
            this._data[key]['data'] = prevData;
        }
        else {

            const {id, content} = data;
            prevData[id] = content;
            options = id;
        }

        this._fireEvents(events, options);
    }

    rewriteData(key, data = null, events = []) {

        const {config: {isTable}} = this._data[key];

        if (!isTable) {
            this._data[key]['data'] = data;
        }
        else {
            this.clear(key);
            this.addData(key, data);
        }

        this._fireEvents(events);
    }

    removeData(key, ids = [], events = []) {

        let options;

        if (Array.isArray(ids)) {

            options = [];

            ids.forEach(id => {
                delete this._data[key]['data'][id];
                options.push(id);
            });
        }
        else {

            const id = ids;

            delete this._data[key]['data'][id];
            options = id;
        }

        this._fireEvents(events, options);
    }

    clear(key, events = []) {

        const currentSegment = this._data[key] || {};
        const {config: {isTable}} = currentSegment;

        const emptyValue = isTable ? {} : null;

        this._data[key]['data'] = emptyValue;

        this._fireEvents(events);
    }

    on(...argList) {

        this._events.on(...argList);
    }

    trigger(...argList) {

        this._events.trigger(...argList);
    }

}