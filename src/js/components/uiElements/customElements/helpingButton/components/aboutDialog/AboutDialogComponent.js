import BaseComponent from 'js/base/BaseComponent';

import View from './view/View';

import { createContainer } from 'js/utils/commonUtils';


export default class AboutDialogComponent extends BaseComponent {

    init() {

        const application = this.getApplication();
        const store = application.getStore();
        const aboutText = store.getData('about');

        this._container = createContainer();

        this._view = new View(this._container, {
            text: aboutText,
            events: this.events
        });
        this._view.hide();

        this._bindEvents();
    }

    show() {

        this.getView().hide();
    }

    hide() {

        this.getView().hide();
    }

    _bindEvents() {

        const { events: localEvents } = this;

        localEvents.on('click', () => {
            window.open ('https://scanex.github.io/Documentation/Catalog/index.html', '_blank');
            this.hide();
        });
    }

}