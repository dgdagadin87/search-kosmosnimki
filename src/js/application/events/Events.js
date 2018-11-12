'use strict';

import _ from 'underscore';


let slice = Array.prototype.slice;
let eventSplitter = /\s+/;

let listenMethods = {
    listenTo: 'on',
    listenToOnce: 'once'
};

let eventsApi = function(obj, action, name, rest) {

    if (!name) {
        return true;
    }

    if (typeof name === 'object') {
        for (let key in name) {
            if (name.hasOwnProperty(key)) {
                obj[action].apply(obj, [key, name[key]].concat(rest));
            }
        }
        return false;
    }

    if (eventSplitter.test(name)) {
        let names = name.split(eventSplitter);
        for (let i = 0, l = names.length; i < l; i++) {
            obj[action].apply(obj, [names[i]].concat(rest));
        }
        return false;
    }

    return true;
};

let triggerEvents = function(events, args) {

    let ev;
    let i = -1;
    let l = events.length;
    let a1 = args[0];
    let a2 = args[1];
    let a3 = args[2];

    switch (args.length) {
        case 0: {
            while (++i < l) {
                (ev = events[i]).callback.call(ev.ctx);
            }
        } return;
        case 1: {
            while (++i < l) {
                (ev = events[i]).callback.call(ev.ctx, a1);
            }
        } return;
        case 2: {
            while (++i < l) {
                (ev = events[i]).callback.call(ev.ctx, a1, a2);
            }
        } return;
        case 3: {
            while (++i < l) {
                (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
            }
        } return;
        default: {
            while (++i < l) {
                (ev = events[i]).callback.apply(ev.ctx, args);
            }
        } return;
    }
};


let Events = function() {
    this._events = [];
};

Events.prototype.on = function(name, callback, context) {
    if (!eventsApi(this, 'on', name, [callback, context]) || !callback) {
        return this;
    }
    if ( ! this._events) {
        this._events = {};
    }
    //let debugCallback = (...args) => {console.log(name);callback(...args)}
    let events = this._events[name] || (this._events[name] = []);
    events.push({callback: callback, context: context, ctx: context || this});
    return this;
};

Events.prototype.once = function(name, callback, context) {
    if (!eventsApi(this, 'once', name, [callback, context]) || !callback) {
        return this;
    }
    let self = this;
    let once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
    });
    once._callback = callback;
    return this.on(name, once, context);
};

Events.prototype.off = function(name, callback, context) {
    let retain, ev, events, names, i, l, j, k;
    if (!this._events || !eventsApi(this, 'off', name, [callback, context])) {
        return this;
    }
    if (!name && !callback && !context) {
        this._events = void 0;
        return this;
    }
    names = name ? [name] : _.keys(this._events);
    for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        events = this._events[name];
        if (events) {
            this._events[name] = retain = [];
            if (callback || context) {
                for (j = 0, k = events.length; j < k; j++) {
                    ev = events[j];
                    if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                        (context && context !== ev.context)) {
                        retain.push(ev);
                    }
                }
            }
            if (!retain.length) {
                delete this._events[name];
            }
        }
    }

    return this;
};

Events.prototype.trigger = function(name) {

    if ( ! this._events) {
        return this;
    }

    let args = slice.call(arguments, 1);

    if ( ! eventsApi(this, 'trigger', name, args)) {
        return this;
    }

    let events = this._events[name];
    let allEvents = this._events.all;

    if (events) {
        triggerEvents(events, args);
    }
    if (allEvents) {
        triggerEvents(allEvents, arguments);
    }

    return this;
};

Events.prototype.stopListening = function(obj, name, callback) {

    let listeningTo = this._listeningTo;

    if ( ! listeningTo) {
        return this;
    }

    let remove = !name && !callback;

    if ( ! callback && typeof name === 'object') {
        callback = this;
    }
    if (obj) {
        (listeningTo = {})[obj._listenId] = obj;
    }

    for (let id in listeningTo) {
        if (listeningTo.hasOwnProperty(id)) {
            obj = listeningTo[id];
            obj.off(name, callback, this);
            if (remove || _.isempty(obj._events)) {
                delete this._listeningTo[id];
            }
        }
    }

    return this;
};

Events.prototype.createEmitter = function(obj) {
    return _.assign(obj || {}, Events);
};


_.forEach(listenMethods, function(implementation, method) {
    Events.prototype[method] = function(obj, name, callback) {

        if ( ! obj) {
            throw new Error('Trying to listenTo event: \'' + name + '\' but the target object is undefined');
        }

        let listeningTo = this._listeningTo || (this._listeningTo = {});
        let id = obj._listenId || (obj._listenId = _.uniqueId('l'));

        listeningTo[id] = obj;

        if (!callback && typeof name === 'object') {
            callback = this;
        }
        if (typeof obj[implementation] !== 'function') {
            throw new Error('Trying to listenTo event: \'' + name + '\' on object: ' + obj.toString() + ' but it does not have an \'on\' method so is unbindable');
        }

        obj[implementation](name, callback, this);

        return this;
    };
});

Events.listenToAndRun = function (obj, name, callback) {

    Events.prototype.listenTo.apply(this, arguments);

    if (!callback && typeof name === 'object') {
        callback = this;
    }

    callback.apply(this);

    return this;
};


export default Events;