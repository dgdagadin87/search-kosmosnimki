import Translations from 'scanex-translations';
import FloatingPanel from 'scanex-float-panel';

import BaseComponent from '../../../../base/BaseComponent';

import { createContainer } from '../../../../utils/commonUtils';


export default class AboutDialogComponent extends BaseComponent {

    init() {

        const application = this.getApplication();
        const mapContainer = application.getMapContainer();

        this._container = createContainer();
        this._container.classList.add('cart-limit-dialog');

        this._view = new FloatingPanel(this._container, {
            id: 'cart.limit.dialog',
            left: Math.round (mapContainer.getBoundingClientRect().width / 2),
            top, modal: true, header: false,
        });
        this._view.content.innerHTML = `${Translations.getText('favorites.limit')}`;
        this._view.footer.innerHTML = `<button class="dialog-cancel-button">${Translations.getText('alerts.close')}</button>`;
        this.hide();

        this._binEvents();
    }

    _binEvents() {

        const cancelButton = this._getCancelButton();

        cancelButton.addEventListener('click', () => this.hide());
    }

    _getCancelButton() {

        return this._container.querySelector('button.dialog-cancel-button');
    }

    show() {

        const view = this.getView();
        view.show();
    }

    hide() {

        const view = this.getView();
        view.hide();
    }

}