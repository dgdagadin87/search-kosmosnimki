import BaseComponent from 'js/base/BaseComponent';

import View from './view/View';


export default class DialogComponent extends BaseComponent {

    init() {

        const application = this.getApplication();

        this._view = new View(application, this.events);

        this._binEvents();
    }

    _binEvents() {

        this.events.on('apply', () => this.events.trigger('click:apply'));
        this.events.on('cancel', () => this.events.trigger('click:cancel'));
    }

    show() {

        const view = this.getView();
        view.show();
    }

    hide() {

        const view = this.getView();
        view.hide();
    }

    getType() {

        const view = this.getView();
        return view.getType();
    }

    getName() {

        const view = this.getView();
        return view.getName();
    }

}