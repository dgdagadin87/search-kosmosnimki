import BaseComponent from '../../base/BaseComponent';

import { createContainer } from '../../miskUtils/utils';


export default class HelpButtonComponent extends BaseComponent {

    constructor(props){
        super(props);

        this._container = document.getElementById('help');
    }

    init() {

        this._component = createContainer();
        this._component.classList.add('help-button');
        this._container.appendChild(this._component);

        this._bindEvents();
    }

    _bindEvents() {

        this._container.addEventListener('click', this._onClickHandler.bind(this));
    }

    _onClickHandler() {

        const app = this.getApplication();
        const appEvents = app.getAppEvents();

        appEvents.trigger('helpButton:click');
    }

}