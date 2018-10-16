import BaseComponent from '../../base/BaseComponent';

import About from './components/About';

import { createContainer } from '../../miskUtils/utils';


export default class AboutDialogComponent extends BaseComponent {

    constructor(props){
        super(props);

        this._container = createContainer();
    }

    init() {

        const application = this.getApplication();
        const store = application.getStore();
        const aboutText = store.getConstantData('about');

        this._component = new About(this._container, {text: aboutText});
        this._component.hide();

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const appEvents = application.getAppEvents();

        appEvents.on('helpButton:click', () => {
            this._component.show();
        });

        /*this._component.addEventListener('logout', () => {
            //localStorage.setItem('view_state', JSON.stringify(get_state()));
            window.location.reload(true);
        });*/
    }

}