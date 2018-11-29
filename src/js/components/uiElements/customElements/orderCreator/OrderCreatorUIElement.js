import BaseUIElement from 'js/base/BaseUIElement';

import LoginDialogComponent from './components/loginDialog/LoginDialogComponent';
import OrderDialogComponent from './components/orderDialog/OrderDialogComponent';
import SuccessDialogComponent from './components/successDialog/SuccessDialogComponent';

import { HOME_LINK } from 'js/config/constants/constants';
import { propertiesToItem } from 'js/utils/commonUtils';


export default class OderCreatorUIElement extends BaseUIElement {

    init() {

        this.initChildren([
            {
                index: 'loginDialog',
                constructor: LoginDialogComponent
            },
            {
                index: 'orderDialog',
                constructor: OrderDialogComponent
            },
            {
                index: 'successDialog',
                constructor: SuccessDialogComponent
            }
        ]);

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const events = application.getServiceEvents();
        const {events: loginEvents} = this.getChildComponent('loginDialog');
        const {events: orderEvents} = this.getChildComponent('orderDialog');
        const {events: successEvents} = this.getChildComponent('successDialog');

        events.on('makeOrder:click', this._onMakeOrderClick.bind(this));

        loginEvents.on('login:click', this._onLoginButtonClick.bind(this));
        successEvents.on('success:click', this._onSuccessButtonClick.bind(this));
        orderEvents.on('warningClick', this._onWarningClick.bind(this));
        orderEvents.on('submitOrder', this._onSubmitOrderClick.bind(this));
    }

    _onMakeOrderClick() {

        const application = this.getApplication();
        const appStateManager = application.getAddon('appStateManager');
        const store = application.getStore();
        const loginDialogComponent = this.getChildComponent('loginDialog');
        const orderDialogComponent = this.getChildComponent('orderDialog');

        const userInfo = store.getData('userInfo');
        const selectedCarts = store.getSelectedFavorites();

        if (selectedCarts.length < 1) {
            return;
        }

        if (!userInfo['IsAuthenticated']) {
            loginDialogComponent.show();
            return;
        }

        const preparedItems = selectedCarts.map(item => {
            const {properties} = item;
            return propertiesToItem(properties);
        });

        appStateManager.getPermalinkId()
        .then(result => orderDialogComponent.show(preparedItems, result))
        .catch(e => this._errorHandler(e))
    }

    _onWarningClick(e) {

        const application = this.getApplication();
        const appStateManager = application.getAddon('appStateManager');
        const {permalink} = e;
        const matches = /link=([^&]+)/g.exec(permalink);

        if (Array.isArray (matches) && matches.length > 0) {
            const permalinkId = matches[1];
            appStateManager.readPermalink(permalinkId)
            .then (response => {
                appStateManager.saveAppStateToLocalStorage(response);
                window.location = HOME_LINK;
            })
            .catch(error => this._errorHandler(error));
        }
        else {
            console.log('Permalink not set:', permalink);
        }
    }

    _onSubmitOrderClick(e) {

        const application = this.getApplication();
        const requestManager = application.getRequestManager();
        const orderDialogComponent = this.getChildComponent('orderDialog');
        const successDialogComponent = this.getChildComponent('successDialog');
        const {data = {}} = e;
        
        requestManager.requestCreateOrder(data)
        .then(response => {

            const {Status: status} = response;

            orderDialogComponent.hide();

            if (status === 'ok') {                    
                successDialogComponent.show();
            }
            else {
                alert('Error! Watch in console');
                window.console.error(response);
            }
        })
        .catch(error => this._errorHandler(error));
    }

    _onLoginButtonClick() {

        const application = this.getApplication();
        const appStateManager = application.getAddon('appStateManager');
        const authContainer = document.getElementById('auth');
        const loginButton = authContainer.querySelector('.authWidget-loginButton');

        const currentAppState = appStateManager.getCurrentApplicationState();
        const savedState = appStateManager.getAppStateFromLocalStorage();
        if (!savedState) {
            appStateManager.saveAppStateToLocalStorage(currentAppState);
        }

        loginButton.click();
    }

    _onSuccessButtonClick() {

        const successDialogComponent = this.getChildComponent('successDialog');

        successDialogComponent.hide();
    }

    _errorHandler(e) {

        const application = this.getApplication();

        application.showError(e.toString());

        window.console.error(e);
    }

}