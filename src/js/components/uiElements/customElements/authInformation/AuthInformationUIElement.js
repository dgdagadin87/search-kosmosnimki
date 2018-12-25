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
        const appStateManager = application.getAddon('appStateManager');
        const view = this.getView();

        view.addEventListener('logout', () => {
            const currentAppState = appStateManager.getCurrentApplicationState();
            appStateManager.saveAppStateToLocalStorage(currentAppState);
            window.location.reload(true);
        });

        setTimeout(() => {
            const loginButton = document.querySelector('.authWidget-loginButton');
            loginButton && loginButton.addEventListener('click', () => {
                const currentAppState = appStateManager.getCurrentApplicationState();
                appStateManager.saveAppStateToLocalStorage(currentAppState);
            });
        }, 0);
    }

}