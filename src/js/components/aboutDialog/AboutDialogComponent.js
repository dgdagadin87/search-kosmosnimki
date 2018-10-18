import BaseComponent from '../../base/BaseComponent';

import About from './components/About';

import { createContainer } from '../../utils/commonUtils';


export default class AboutDialogComponent extends BaseComponent {

    constructor(props){
        super(props);

        this._container = createContainer();
    }

    init() {

        const application = this.getApplication();
        const store = application.getStore();
        const aboutText = store.getConstantableData('about');

        this._component = new About(this._container, {
            text: aboutText,
            events: this.events
        });
        this._component.hide();

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const appEvents = application.getAppEvents();

        const { events: localEvents } = this;

        appEvents.on('helpButton:click', () => {
            this._component.show();
        });

        localEvents.on('click', () => {
            window.open ('https://scanex.github.io/Documentation/Catalog/index.html', '_blank');
            this._component.hide();
        });
    }

}