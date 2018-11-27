import Translations from 'scanex-translations';


export default class View {

    constructor(config) {

        this._tabComponent = config.parent || {};

        this._main = this._tabComponent.getView();

        this._main.innerHTML = 
        `<div class="results-header">
            <span class="results-title">${Translations.getText('results.title')}</span>
            <span class="results-number">0</span>
            <div class="results-buttons">                
                <i title="${Translations.getText('results.quicklooks.cart')}" class="quicklooks-cart"></i>
                <i title="${Translations.getText('results.clear')}" class="results-clear"></i>
                <a id="qqqqq" href="#">qqqqq</a>
            </div>
        </div>
        <div class="results-pane"></div>`;
    }

    getResultsNumSpan() {

        const resultsNumSpan = this._main.querySelector('span.results-number');

        return resultsNumSpan;
    }

    getQuickLooksCartButton() {

        const quickLooksCartButton = this._main.querySelector('i.quicklooks-cart');

        return quickLooksCartButton;
    }

    getClearResultsButton() {

        const clearResultsButton = this._main.querySelector('i.results-clear');

        return clearResultsButton;
    }

    updateResultsNumber(number) {

        const resultsNumSpan = this.getResultsNumSpan();

        resultsNumSpan.innerText = number;
    }

    updateQuickLooksCartButton(hasVisibleResults) {

        const quickLooksCartButton = this.getQuickLooksCartButton();
        
        if (hasVisibleResults){
            quickLooksCartButton.classList.add('quicklooks-cart-active');
            quickLooksCartButton.classList.remove('quicklooks-cart-passive');
        }
        else {
            quickLooksCartButton.classList.remove('quicklooks-cart-active');
            quickLooksCartButton.classList.add('quicklooks-cart-passive');
        }
    }

}