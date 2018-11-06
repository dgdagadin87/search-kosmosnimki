import BaseComponent from '../../../../base/BaseComponent';

import View from './view/View';


export default class SuccessDialogComponent extends BaseComponent {

    init() {

        const application = this.getApplication();

        this._view = new View(this.events);

        this._binEvents();
    }

    _binEvents() {

        this.events.on('click', () => this.events.trigger('success:click'));
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