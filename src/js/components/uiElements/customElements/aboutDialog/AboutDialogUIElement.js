import BaseUIElement from 'js/base/BaseUIElement';

import About from './view/View';

import { createContainer } from 'js/utils/commonUtils';


export default class AboutDialogUIElement extends BaseUIElement {

    init() {

        const application = this.getApplication();
        const store = application.getStore();
        const aboutText = store.getMetaItem('about');

        this._container = createContainer();

        this._view = new About(this._container, {
            text: aboutText,
            events: this.events
        });
        this.getView().hide();

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const events = application.getServiceEvents();

        const { events: localEvents } = this;

        events.on('helpButton:click', () => {
            this.getView().show();
        });

        localEvents.on('click', () => {
            window.open ('https://scanex.github.io/Documentation/Catalog/index.html', '_blank');
            this.getView().hide();
        });
    }

}