import Translations from 'scanex-translations';
import FloatingPanel from 'scanex-float-panel';

import { createContainer, getMapCenter } from '../../../../utils/commonUtils';


export default class ErrorDialogView {

    constructor(events) {

        this.events = events;

        const {left, top} = getMapCenter();

        this._container = createContainer();
        this._container.classList.add('error-message-dialog');

        this._main = new FloatingPanel(this._container, {
            id: 'error.message.dialog',
            left,
            top, modal: true, header: false,
        });
        
        this._main.content.innerHTML = `${Translations.getText('favorites.limit')}`;
        this._main.footer.innerHTML = `<button class="dialog-close-button">${Translations.getText('alerts.close')}</button>`;

        this.hide();

        this._binEvents();
    }

    _binEvents() {

        const cancelButton = this._getCloseButton();

        cancelButton.addEventListener('click', () => this.hide());
    }

    _getCloseButton() {

        return this._container.querySelector('button.dialog-close-button');
    }

    show() {

        this._main.show();
    }

    hide() {

        this._main.hide();
    }

}