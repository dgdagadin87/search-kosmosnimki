import BaseComponent from '../../base/BaseComponent';

import { createContainer } from '../../utils/commonUtils';


export default class HelpingButtonComponent extends BaseComponent {

    init() {

        this._container = document.getElementById('help');

        this._view = createContainer();
        this._view.classList.add('help-button');
        this._container.appendChild(this._view);

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