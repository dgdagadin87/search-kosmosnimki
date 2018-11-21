import BaseComponent from 'js/base/BaseComponent';

import About from './_inner/About';

import { createContainer } from 'js/utils/commonUtils';


export default class AboutDialogComponent extends BaseComponent {

    init() {

        const application = this.getApplication();
        const store = application.getStore();
        const aboutText = store.getData('about');

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
        const appEvents = application.getAppEvents();

        const { events: localEvents } = this;

        appEvents.on('helpButton:click', () => {
            this.getView().show();
        });

        localEvents.on('click', () => {
            window.open ('https://scanex.github.io/Documentation/Catalog/index.html', '_blank');
            this.getView().hide();
        });
    }

}