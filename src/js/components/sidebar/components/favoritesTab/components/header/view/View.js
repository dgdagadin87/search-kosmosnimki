import Translations from 'scanex-translations';


export default class View {

    constructor(config) {

        this._tabComponent = config.parent || {};

        this._main = this._tabComponent.getView();

        this._main.innerHTML = 
        `<div class="favorites-header">
        <span class="favorites-title">${Translations.getText('results.favorites')}</span>
        <span class="favorites-number">0</span>
            <div class="favorites-buttons">
                <i title="${Translations.getText('favorites.delete')}" class="favorites-delete-button"></i>
            </div>
        </div>
        <div class="favorites-pane"></div>`;
    }

    getCartInnerNumberSpan() {

        return document.body.querySelector('[data-pane-id=favorites] span.favorites-number');
    }

    getFavoritesRemoveButton() {

        return document.body.querySelector('[data-pane-id=favorites] .favorites-delete-button');
    }

}