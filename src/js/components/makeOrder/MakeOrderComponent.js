import BaseCompositedComponent from '../../base/BaseCompositedComponent';

import LoginDialogComponent from './components/loginDialog/LoginDialogComponent';
import OrderDialogComponent from './components/orderDialog/OrderDialogComponent';
import SuccessDialogComponent from './components/successDialog/SuccessDialogComponent';

import { getCorrectIndex, propertiesToItem } from '../../utils/commonUtils';


export default class MakeOrderComponent extends BaseCompositedComponent {

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
        const appEvents = application.getAppEvents();
        const loginDialogComponent = this.getChildComponent('loginDialog');
        const orderDialogComponent = this.getChildComponent('orderDialog');
        const successDialogComponent = this.getChildComponent('successDialog');
        const loginEvents = loginDialogComponent.events;
        const orderEvents = orderDialogComponent.events;
        const successEvents = successDialogComponent.events;

        appEvents.on('makeOrder:click', this._onMakeOrderClick.bind(this));

        loginEvents.on('login:click', this._onLoginButtonClick.bind(this));
        successEvents.on('success:click', this._onSuccessButtonClick.bind(this));
        orderEvents.on('submitOrder', this._onSubmitOrderClick.bind(this));
    }

    _onMakeOrderClick() {

        const application = this.getApplication();
        const store = application.getStore();
        const userInfo = store.getData('userInfo');
        const selectedIndex = getCorrectIndex('selected');
        const cartIndex = getCorrectIndex('cart');
        const contours = store.getSerializedData('contours');
        const loginDialogComponent = this.getChildComponent('loginDialog');
        const orderDialogComponent = this.getChildComponent('orderDialog');

        const selectedCarts = contours.filter(item => {
            const {properties} = item;
            if (!properties) {
                return false;
            }
            if (properties[selectedIndex] && properties[cartIndex]) {
                return true;
            }
            return false;
        });

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

        orderDialogComponent.show(preparedItems);
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
        .catch(error => {
            alert('Error! Watch in console');
            window.console.error(error);
        });
    }

    _onLoginButtonClick() {

        // ... if (!localStorage.getItem('view_state)) { ...  set localStore state ... } // TODO - permalink

        const authContainer = document.getElementById('auth');
        const loginButton = authContainer.querySelector('.authWidget-loginButton');

        loginButton.click();
    }

    _onSuccessButtonClick() {

        const successDialogComponent = this.getChildComponent('successDialog');

        successDialogComponent.hide();
    }

}