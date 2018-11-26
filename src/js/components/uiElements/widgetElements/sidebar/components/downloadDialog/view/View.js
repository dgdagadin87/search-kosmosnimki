import Translations from 'scanex-translations';
import FloatingPanel from 'scanex-float-panel';

import { ACCESS_USER_ROLE } from 'js/config/constants/constants';

import { createContainer, getMapCenter } from 'js/utils/commonUtils';


export default class DownloadDialogView {

    constructor(application, events) {

        this.events = events;

        this.application = application;

        const {top, left} = getMapCenter();

        const isUserAuthenticated = this._isUserIsAuthenticated();

        const dialogClass = !isUserAuthenticated ? 'download-change-dialog' : 'download-result-dialog';
        const dialogId = !isUserAuthenticated ? 'download.change.dialog' : 'download.result.dialog';

        this._container = createContainer();
        this._container.classList.add(dialogClass);

        this._main = new FloatingPanel(this._container, {
            id: dialogId,
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
            this._main.content.innerHTML = `${Translations.getText('results.download')}`;
            this._main.footer.innerHTML = 
            `<button class="dialog-ok-button">${Translations.getText('download.ok')}</button>
            <button class="dialog-cancel-button">${Translations.getText('download.cancel')}</button>`;
        }

        this.hide();

        this._binEvents();
    }

    _binEvents() {

        const isUserAuthenticated = this._isUserIsAuthenticated();
        const closeButton = isUserAuthenticated ? this._getCancelButton() : this._getCloseButton();
        const applyButton = this._getApplyButton();
        
        closeButton.addEventListener('click', () => this.events.trigger('cancel'));

        if (isUserAuthenticated) {
            applyButton.addEventListener('click', () => this.events.trigger('apply'));
        }
    }

    _getApplyButton() {

        return this._container.querySelector('button.dialog-ok-button');
    }

    _getCloseButton() {

        return this._container.querySelector('button.dialog-close-button');
    }

    _getCancelButton() {

        return this._container.querySelector('button.dialog-cancel-button');
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