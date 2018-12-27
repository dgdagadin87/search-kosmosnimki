import BaseComponent from 'js/base/BaseComponent';

import { createContainer } from 'js/utils/CommonUtils';

import View from './view/View';


export default class ResultListComponent extends BaseComponent {

    init() {

        this._view = new View({
            target: createContainer()
        });
    }

    shift(width) {

        this._view.set({
            left: width
        });
    }

    show() {

        this._view.set({
            hidden: false
        });
    }

    hide() {

        this._view.set({
            hidden: true
        });
    }

}