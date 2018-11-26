import BaseComponent from 'js/base/BaseComponent';

import ImageDetails from './view/ImageDetails';

import { createContainer } from 'js/utils/commonUtils';


export default class ImageDetailsComponent extends BaseComponent {

    init() {

        this._view = new ImageDetails(
            createContainer(),
            { left: 600, top: 300 }
        );
    }

    toggle(e, bBox) {

        const view = this.getView();

        const {item, top, button} = e.detail;
        const {left, width} = bBox;

        view.button = button;

        if (view.visible && view.item.sceneid == item.sceneid) {
            view.hide();
        }
        else {
            view.hide();
            view.item = item;                
            view.show({left: left + width + 20, top});
        }
    }

}