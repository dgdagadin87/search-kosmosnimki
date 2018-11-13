import BaseComponent from '../../../base/BaseComponent';

import View from './view/View';


export default class ErrorDialogComponent extends BaseComponent {

    init() {

        const application = this.getApplication();

        this._view = new View(application, this.events);

        this._binEvents();
    }

    _binEvents() {

        this.events.on('cancel', () => this.hide());
    }

    show() {

        const view = this.getView();
        view.show();
    }

    hide() {

        const view = this.getView();
        view.hide();
    }

}