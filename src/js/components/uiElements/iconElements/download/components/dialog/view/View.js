import Translations from 'scanex-translations';

import { createContainer } from 'js/utils/CommonUtils';


export default class DialogView {

    constructor(application, events) {

        this.events = events;

        this._container = createContainer();
        this._container.classList.add('dialog-download');
        
        this.hide();

        this._container.innerHTML = 
        `<table border="0" cellspacing="0" cellpadding="0">
            <tbody>
                <tr>
                    <td class="download-type">${Translations.getText('download.type')}</td>
                    <td>
                        <select>                        
                            <option value="borders">${Translations.getText('download.borders')}</option>
                            <option value="results">${Translations.getText('download.results')}</option>
                            <option value="rcsv">${Translations.getText('download.rcsv')}</option>
                            <option value="cart">${Translations.getText('download.cart')}</option>
                            <option value="ccsv">${Translations.getText('download.ccsv')}</option>
                            <option value="quicklooks">${Translations.getText('download.quicklooks')}</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="download-file">${Translations.getText('download.file')}</td>
                    <td>
                        <input type="text" value="${Translations.getText('download.noname')}"/>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" class="download-footer">
                        <button class="download-ok">${Translations.getText('download.ok')}</button>
                        <button class="download-cancel">${Translations.getText('download.cancel')}</button>
                    </td>
                </tr>
            </tbody>
        </table>`;

        this._container.style.top = '50px';
        this._container.style.left = '450px';

        this._main = this._container;

        this.hide();

        this._binEvents();
    }

    _binEvents() {

        const cancelButton = this._getCancelButton();
        const applyButton = this._getApplyButton();

        applyButton.addEventListener('click', () => this.events.trigger('apply'));
        cancelButton.addEventListener('click', () => this.events.trigger('cancel'));
    }

    _getApplyButton() {

        return this._container.querySelector('button.download-ok');
    }

    _getCancelButton() {

        return this._container.querySelector('button.download-cancel');
    }

    show() {

        this._container.style.display = 'block';
    }

    hide() {

        this._container.style.display = 'none';
    }

    getType() {

        return this._container.querySelector('select').value;
    }

    getName() {

        return this._container.querySelector('input[type=text]').value;
    }

}