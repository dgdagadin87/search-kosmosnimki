import Translations from 'scanex-translations';


export default class View {

    constructor(config) {

        this._tabComponent = config.parent || {};

        const tabView = this._tabComponent.getView();

        tabView.innerHTML = 
        `<div class="results-header">
            <span class="results-title">${Translations.getText('results.title')}</span>
            <span class="results-number">0</span>
            <div class="results-buttons">                
                <i title="${Translations.getText('results.quicklooks.cart')}" class="quicklooks-cart"></i>
                <i title="${Translations.getText('results.clear')}" class="results-clear"></i>
            </div>
        </div>
        <div class="results-pane"></div>`;
    }

    getResultsNumSpan() {

        const resultsNumSpan = document.querySelector('#map div.panes div.results-header > span.results-number');

        return resultsNumSpan;
    }

    getQuickLooksCartButton() {

        const quickLooksCartButton = document.querySelector('#map div.panes div.results-header > div > i.quicklooks-cart');

        return quickLooksCartButton;
    }

    getClearResultsButton() {

        const clearResultsButton = document.querySelector('#map div.panes div.results-header > div > i.results-clear');

        return clearResultsButton;
    }

}