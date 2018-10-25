import Events from './Events';


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

        const {key, isTable = false, indexBy = ''} = item;

        this._data[key] = {
            data: isTable ? {} : null,
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

        this._data[key]['data'] = data;

        this._fireEvents(events);
    }

    removeData(key, ids = [], events = []) {

        const currentSegment = this._data[key] || {};

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

    /*setData(key, data, options = {}) {

        const {
            mode = 'full',
            operation = 'update',
            events = []
        } = options;

        const {isTable} = this._data['changeable'][key]['config'];

        const {indexByValue} = options;

        // set value
        if (mode === 'full') {

            if (operation === 'update') {

                this._data[key]['data'] = data;
            }
            else if (operation === 'delete') {

                const emptyValue = isTable ? {} : null;
                this._data[key]['data'] = emptyValue;
            }
            else if (operation === 'add') {

                this._data[key]['data'] = data;
            }
        }
        else if (mode === 'row') {

            if (operation === 'update') {
                
                this._data[key]['data'][indexByValue] = data;
            }
            else if (operation === 'delete') {

                delete this._data[key]['data'][indexByValue];
            }
            else if (operation === 'add') {

                this._data[key]['data'][indexByValue] = data;
            }
        }

        // event firing
        if(events.length < 1) {
            return;
        }
        else {

            events.forEach(eventName => {

                const eventOptions = mode === 'row' ? {rowId: indexByValue} : {};

                this._events.trigger(eventName, eventOptions);
            });
        }
    }*/

    on(...argList) {

        this._events.on(...argList);
    }

    trigger(...argList) {

        this._events.trigger(...argList);
    }

}