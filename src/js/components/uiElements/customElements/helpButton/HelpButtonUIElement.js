import BaseUIElement from 'js/base/BaseUIElement';

import { createContainer } from 'js/utils/commonUtils';

//import ABoutDialogComponent from './components/aboutDialog/AboutDialogComponent';


export default class HelpButtonUIElement extends BaseUIElement {

    init() {

        this._container = document.getElementById('help');

        this._view = createContainer();
        this._view.classList.add('help-button');
        this._container.appendChild(this._view);

        /*this.initChildren([
            {
                index: 'dialog',
                constructor: ABoutDialogComponent
            }
        ])*/

        this._bindEvents();
    }

    _bindEvents() {

        this._container.addEventListener('click', this._onClickHandler.bind(this));
    }

    _onClickHandler() {

        window.open ('https://scanex.github.io/Documentation/Catalog/index.html', '_blank');
    }

}