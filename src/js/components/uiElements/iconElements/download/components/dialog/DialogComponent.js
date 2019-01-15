import BaseComponent from 'js/base/BaseComponent';

import { createContainer } from 'js/utils/CommonUtils';

import View from './view/View.html';


export default class DialogComponent extends BaseComponent {

    init() {

        this._view = new View({
            target: createContainer()
        })

        this._binEvents();
    }

    _binEvents() {

        const view = this.getView();

        view.on('apply', () => this.events.trigger('click:apply'));
        view.on('cancel', () => this.events.trigger('click:cancel'));
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