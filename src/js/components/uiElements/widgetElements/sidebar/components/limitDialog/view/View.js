import Translations from 'scanex-translations';
import FloatingPanel from 'scanex-float-panel';

import { createContainer, getMapCenter } from 'js/utils/CommonUtils';


export default class LimitDialogView {

    constructor(application, events) {

        this.events = events;

        const mapContainer = application.getMapContainer();

        const {top} = getMapCenter();

        this._container = createContainer();
        this._container.classList.add('cart-limit-dialog');

        this._main = new FloatingPanel(this._container, {
            id: 'cart.limit.dialog',
            left: Math.round (mapContainer.getBoundingClientRect().width / 2),
            top, modal: true, header: false,
        });
        
        this._main.content.innerHTML = `${Translations.getText('favorites.limit')}`;
        this._main.footer.innerHTML = `<button class="dialog-cancel-button">${Translations.getText('alerts.close')}</button>`;

        this.hide();

        this._binEvents();
    }

    _binEvents() {

        const cancelButton = this._getCancelButton();

        cancelButton.addEventListener('click', () => this.hide());
    }

    _getCancelButton() {

        return this._container.querySelector('button.dialog-cancel-button');
    }

    show() {

        this._main.show();
    }

    hide() {

        this._main.hide();
    }

}