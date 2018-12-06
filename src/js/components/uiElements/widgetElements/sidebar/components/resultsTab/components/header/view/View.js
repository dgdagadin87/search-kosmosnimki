import Translations from 'scanex-translations';


export default class View {

    constructor(config) {

        this._tabComponent = config.parent || {};

        this._main = this._tabComponent.getView();

        this._main.innerHTML = 
        `<div class="results-header">
            <span class="results-title">${Translations.getText('results.title')}</span>
            <span class="results-number"><span class="filtered-results-number">0</span>/<span class="all-results-number">0</span></span>
            <span class="results-clear-filter">${Translations.getText('results.clearFilter')}</span>
            <div class="results-buttons">                
                <i title="${Translations.getText('results.quicklooks.cart')}" class="quicklooks-cart"></i>
                <i title="${Translations.getText('results.clear')}" class="results-clear"></i>
            </div>
        </div>
        <div class="results-pane"></div>`;
    }

    getFilteredResultsNumSpan() {

        const resultsNumSpan = this._main.querySelector('span.filtered-results-number');

        return resultsNumSpan;
    }

    getAllResultsNumSpan() {

        const resultsNumSpan = this._main.querySelector('span.all-results-number');

        return resultsNumSpan;
    }

    getClearFilterSpan() {

        const clearFilterSpan = this._main.querySelector('span.results-clear-filter');

        return clearFilterSpan;
    }

    getQuickLooksCartButton() {

        const quickLooksCartButton = this._main.querySelector('i.quicklooks-cart');

        return quickLooksCartButton;
    }

    getClearResultsButton() {

        const clearResultsButton = this._main.querySelector('i.results-clear');

        return clearResultsButton;
    }

    updateClearFilterSpan(state) {

        const clearFilter = this.getClearFilterSpan();
        const display = state ? 'inline' : 'none';

        clearFilter.style.display = display;
    }

    updateFilteredResultsNumber(number) {

        const resultsNumSpan = this.getFilteredResultsNumSpan();

        resultsNumSpan.innerText = number;
    }

    updateAllResultsNumber(number) {

        const resultsNumSpan = this.getAllResultsNumSpan();

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