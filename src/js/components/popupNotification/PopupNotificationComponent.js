import NotificationWidget from 'scanex-notify-widget';

import { NOTIFICATION_HIDE_TIMEOUT } from '../../config/constants/constants';

import BaseComponent from '../../base/BaseComponent';


export default class PopupNotificationComponent extends BaseComponent {

    init() {

        const map = this.getMap();

        this._view = new NotificationWidget(
            map._controlCorners.right,
            {timeout: NOTIFICATION_HIDE_TIMEOUT}
        );
    }

    show(message) {

        const view = this.getView();
        
        view.content.innerText = message;
        view.show();
    }

}