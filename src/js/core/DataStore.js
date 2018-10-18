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

        constantable.forEach(key => this._createConstantableSegment(key));
    }

    _createConstantableSegment(key) {

        this._data['constantable'][key] = {};
    }

    _createChangeable(changeable = []) {

        changeable.forEach(segment => this._createChangeableSegment(segment));
    }

    _createChangeableSegment(segment) {

        const {key, isTable = false, indexBy = ''} = segment;

        this._data['changeable'][key] = {
            data: isTable ? {} : null,
            config:{
                indexBy,
                isTable
            }
        };
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
        const keySegment = changeable[key] || {};
        const {data} = keySegment;

        const { mode = 'full', rowId = null } = options;

        if (mode === 'full') {
            return data;
        }
        else {
            return data[rowId];
        }
    }

    setChangeableData(key, data, options = {}) {

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

                this._data['changeable'][key]['data'] = data;
            }
            else if (operation === 'delete') {

                const emptyValue = isTable ? {} : null;
                this._data['changeable'][key]['data'] = emptyValue;
            }
            else if (operation === 'add') {

                this._data['changeable'][key]['data'] = data;
            }
        }
        else if (mode === 'row') {

            if (operation === 'update') {
                
                this._data['changeable'][key]['data'][indexByValue] = data;
            }
            else if (operation === 'delete') {

                delete this._data['changeable'][key]['data'][indexByValue];
            }
            else if (operation === 'add') {

                this._data['changeable'][key]['data'][indexByValue] = data;
            }
        }

        // event firing
        if(events.length < 1) {
            return;
        }
        else {

            events.forEach(eventName => {

                const finalEventName = `${key}:${mode}:${operation}:${eventName}`;
                const eventOptions = mode === 'row' ? {rowId: indexByValue} : {};

                this._events.trigger(finalEventName, eventOptions);

                window.console.log(`Event ${finalEventName} was triggered`);
            });
        }
    }

    // короткая запись get<Changeable|Constantable>Data
    getData(key, rowId = false, mode = 'changeable') {

        if (mode === 'constantable') {
            return this.getConstantableData(key);
        }

        return this.getChangeableData(key, {
            mode: rowId === false ? 'full' : 'row',
            rowId: rowId
        });
    }

    on(...argList) {

        this._events.on(...argList);
    }

}