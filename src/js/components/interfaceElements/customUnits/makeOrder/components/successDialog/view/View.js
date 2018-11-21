import Translations from 'scanex-translations';
import FloatingPanel from 'scanex-float-panel';

import { createContainer, getMapCenter } from 'js/utils/commonUtils';


export default class LoginDialogView {

    constructor(events) {

        this.events = events;

        const {top, left} = getMapCenter();

        this._container = createContainer();
        this._container.classList.add('cart-dialog');

        this._main = new FloatingPanel(
            this._container,
            {
                id: 'cart.dialog',
                left,
                top,
                modal: true
            }
        );
        
        this._main.content.innerHTML = 
        `<div>${Translations.getText('cart.success.header')}</div>
        <div>${Translations.getText('cart.success.content')}</div>
        <div>${Translations.getText('cart.success.footer')}</div>`;;
        this._main.footer.innerHTML = `<button class="cart-close-button">${Translations.getText('cart.close')}</button>`;

        this.hide();

        this._binEvents();
    }

    _binEvents() {

        const successButton = this._getSuccessButton();

        successButton.addEventListener('click', () => this.events.trigger('click'));
    }

    _getSuccessButton() {

        return this._container.querySelector('button');
    }

    show() {

        this._main.show();
    }

    hide() {

        this._main.hide();
    }

}