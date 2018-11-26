import BaseUIElement from 'js/base/BaseUIElement';

import View from './view/View';


export default class ErrorDialogUIElement extends BaseUIElement {

    init() {

        const application = this.getApplication();

        this._view = new View(application, this.events);

        this._binEvents();
    }

    _binEvents() {

        this.events.on('cancel', () => this.hide());
    }

    show(errorText) {

        const view = this.getView();
        view.show(errorText);
    }

    hide() {

        const view = this.getView();
        view.hide();
    }

}