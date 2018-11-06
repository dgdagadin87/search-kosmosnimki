import BaseComponent from '../../../../base/BaseComponent';

import View from './view/View';

import { getMapCenter, createContainer } from '../../../../utils/commonUtils';

import { ACCESS_USER_ROLE } from '../../../../config/constants/constants';


export default class OrderDialogComponent extends BaseComponent {

    init() {

        const application = this.getApplication();
        const store = application.getStore();
        const userInfo = store.getData('userInfo');
        const {left, top} = getMapCenter();
        const internal = userInfo['Role'] === ACCESS_USER_ROLE;

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
        view.addEventListener('submitOrder', (e) => this.events.trigger('submitOrder', e));
    }

    show(items) {

        const view = this.getView();
        
        view.items = items;
        view.permalink = '_only_permalink'; // TODO - permalink

        view.show();
    }

    hide() {

        const view = this.getView();
        view.hide();
    }

}