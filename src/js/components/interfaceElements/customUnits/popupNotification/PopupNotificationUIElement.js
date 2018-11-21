import NotificationWidget from 'scanex-notify-widget';

import { NOTIFICATION_HIDE_TIMEOUT } from 'js/config/constants/constants';

import BaseUIElement from 'js/base/BaseUIElement';


export default class PopupNotificationUIElement extends BaseUIElement {

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