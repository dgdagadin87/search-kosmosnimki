import { AuthWidget } from 'scanex-auth';

import BaseUIElement from 'js/base/BaseUIElement';


export default class UserInformationUIElement extends BaseUIElement {

    init() {

        const application = this.getApplication();
        const requestManager = application.getRequestManager();
        const authManager = requestManager.getAuthManager();

        this._container = document.getElementById('auth');

        this._view = new AuthWidget({ authManager });
        this._view.appendTo(this._container);

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const permalinkManager = application.getAddon('permalinkManager');
        const view = this.getView();

        view.addEventListener('logout', () => {
            const currentAppState = permalinkManager.getCurrentApplicationState();
            permalinkManager.saveAppStateToLocalStorage(currentAppState);
            window.location.reload(true);
        });
    }

}