import Translations from 'scanex-translations';
import FloatingPanel from 'scanex-float-panel';

import { ACCESS_USER_ROLE } from '../../../../../config/constants/constants';

import { createContainer, getMapCenter } from '../../../../../utils/commonUtils';


export default class LimitDialogView {

    constructor(application, events) {

        this.events = events;

        this.application = application;

        const {top, left} = getMapCenter();

        const isUserAuthenticated = this._isUserIsAuthenticated();

        const dialogClass = !isUserAuthenticated ? 'download-change-dialog' : '';

        this._container = createContainer();
        this._container.classList.add(dialogClass);

        this._main = new FloatingPanel(this._container, {
            id: !isUserAuthenticated ? 'download.change.dialog' : '',
            left,
            top,
            modal: true,
            header: false,
        });

        if (!isUserAuthenticated) {
            this._main.content.innerHTML = `${Translations.getText('results.change')}`;
            this._main.footer.innerHTML = `<button class="dialog-close-button">${Translations.getText('alerts.ok')}</button>`;
        }
        else {
            // ...
        }

        this.hide();

        this._binEvents();
    }

    _binEvents() {

        const closeButton = this._getCloseButton();

        closeButton.addEventListener('click', () => this.hide());
    }

    _getCloseButton() {

        return this._container.querySelector('button.dialog-close-button');
    }

    _isUserIsAuthenticated() {

        const store = this.application.getStore();
        const userInfo = store.getData('userInfo');

        return userInfo['IsAuthenticated'] && userInfo['Role'] === ACCESS_USER_ROLE;
    }

    show() {

        this._main.show();
    }

    hide() {

        this._main.hide();
    }

}