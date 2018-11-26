import Translations from 'scanex-translations';
import FloatingPanel from 'scanex-float-panel';

import { createContainer, getMapCenter } from 'js/utils/commonUtils';


export default class LoginDialogView {

    constructor(application, events) {

        this.events = events;

        const mapContainer = application.getMapContainer();

        const {top} = getMapCenter();

        this._container = createContainer();
        this._container.classList.add('auth-dialog');

        this._main = new FloatingPanel(this._container, {
            id: 'auth.dialog',
            left: Math.round (mapContainer.getBoundingClientRect().width / 2),
            top, modal: true
        });
        
        this._main.content.innerHTML = `${Translations.getText('alerts.authenticate')}`;
        this._main.footer.innerHTML = `<button class="dialog-login-button">${Translations.getText('alerts.login')}</button>`;

        this.hide();

        this._binEvents();
    }

    _binEvents() {

        const cancelButton = this._getLoginButton();

        cancelButton.addEventListener('click', () => this.events.trigger('click'));
    }

    _getLoginButton() {

        return this._container.querySelector('button.dialog-login-button');
    }

    show() {

        this._main.show();
    }

    hide() {

        this._main.hide();
    }

}