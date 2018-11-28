import BaseComponent from 'js/base/BaseComponent';

import { createContainer, getRootUrl } from 'js/utils/commonUtils';

import View from './view/View.html';


export default class PermalinkFormComponent extends BaseComponent {

    init() {

        const container = createContainer();

        this._view = new View({
            target: container
        });

        this._bindEvents();
    }

    _bindEvents() {

        const view = this.getView();

        view.on('copy', (input) => this.events.trigger('click:copy', input));
    }

    showLoading() {

        const view = this.getView();

        view.set({
            hidden: false,
            loading: true,
            text: ''
        });
    }

    showInput(permalinkId) {

        const view = this.getView();
        const preparedUrl = `${getRootUrl()}?link=${permalinkId}`;

        view.set({
            hidden: false,
            loading: false,
            text: preparedUrl
        });
    }

}