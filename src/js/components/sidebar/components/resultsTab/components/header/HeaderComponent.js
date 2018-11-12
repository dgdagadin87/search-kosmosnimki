import BaseComponent from '../../../../../../base/BaseComponent';

import View from './view/View';

import { propertiesToItem } from '../../../../../../utils/commonUtils';


export default class HeaderComponent extends BaseComponent {

    init() {

        const parentComponent = this.getParentComponent();

        this._view = new View({
            parent: parentComponent
        });

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const store = application.getStore();
        const clearButton = this._getClearResultsButton();

        store.on('snapshots:researched', this._onStoreResearchHandler.bind(this));
        clearButton.addEventListener('click', () => this.events.trigger('results:clear'));
    }

    _getResultsNumSpan() {

        return this._view.getResultsNumSpan();
    }

    _getQuickLooksCartButton() {

        return this._view.getQuickLooksCartButton();
    }

    _getClearResultsButton() {

        return this._view.getClearResultsButton();
    }

    _onStoreResearchHandler() {

        const application = this.getApplication();
        const store = application.getStore();

        const snapshotItems = store.getData('snapshots');
        const commonData = Object.keys(snapshotItems).map((id) => {
            
            const item = snapshotItems[id];
            const {properties} = item;

            return propertiesToItem(properties);
        });
        const filteredData = commonData.filter(item => item.result);
        const visibleData = filteredData.filter(item => item.visible === 'visible');

        const dataLength = filteredData.length;
        const visibleLength = visibleData.length;

        this._updateResultsNumber(dataLength);
        this._updateQuickLooksCartButton(visibleLength);
    }

    _updateResultsNumber(number) {

        const resultsNumSpan = this._getResultsNumSpan();
        resultsNumSpan.innerText = number;
    }

    _updateQuickLooksCartButton(number) {

        const quickLooksCartButton = this._getQuickLooksCartButton();
        
        if (number > 0){
            quickLooksCartButton.classList.add('quicklooks-cart-active');
            quickLooksCartButton.classList.remove('quicklooks-cart-passive');
        }
        else {
            quickLooksCartButton.classList.remove('quicklooks-cart-active');
            quickLooksCartButton.classList.add('quicklooks-cart-passive');
        }
    }

}