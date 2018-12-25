import BaseComponent from 'js/base/BaseComponent';

import View from './view/View';

import { getMapCenter, createContainer, getRootUrl } from 'js/utils/CommonUtils';

import { ACCESS_USER_ROLE } from 'js/config/constants/Constants';


export default class OrderDialogComponent extends BaseComponent {

    init() {

        const application = this.getApplication();
        const store = application.getStore();
        const userInfo = store.getData('userInfo');
        const {left, top} = getMapCenter();
        const internal = userInfo['IsAuthenticated'] && userInfo['Role'] === ACCESS_USER_ROLE;

        const container = createContainer();

        this._view = new View(
            container,
            {
                catalogResourceServer: null, 
                left,
                top,
                userInfo,
                internal,
                modal: true
            }
        );

        this._binEvents();
    }

    _binEvents() {

        const view = this.getView();

        view.addEventListener('editSettings', (e) => this.events.trigger('editSettings', e));
        view.addEventListener('warningClick', (e) => this.events.trigger('warningClick', e));
        view.addEventListener('submitOrder', (e) => this.events.trigger('submitOrder', e));
    }

    show(items, permalink) {

        const view = this.getView();
        
        view.items = items;
        view.permalink = `${getRootUrl()}?link=${permalink}`;

        view.show();
    }

    hide() {

        const view = this.getView();
        view.hide();
    }

}