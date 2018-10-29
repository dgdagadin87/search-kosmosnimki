import Translations from 'scanex-translations';

import BaseCompositedComponent from '../../../../base/BaseCompositedComponent';

import ResultListComponent from './components/resultsList/ResultsListComponent';

import { propertiesToItem } from '../../../../utils/commonUtils';


export default class ResultTabComponent extends BaseCompositedComponent {

    init() {

        this._addTabToSidebar();

        this._resultListComponent = new ResultListComponent(this.getConfig());

        this._resultListComponent.init();

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const store = application.getStore();

        store.on('snapshots:researched', this._onStoreResearchHandler.bind(this));

        this._resultListComponent.events.on('imageDetails:show', (e, bBox) => this.events.trigger('imageDetails:show', e, bBox));
    }

    _addTabToSidebar() {

        this._view = this.getParentComponent().getView().addTab({
            id: 'results',            
            icon: 'sidebar-results',
            opened: 'sidebar-results-opened',
            closed: 'sidebar-results-closed',
            tooltip: Translations.getText('results.title')
        })

        this.getView().innerHTML = 
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

    _getResultsNumSpan() {

        const sidebarComponent = this.getParentComponent();
        const sidebarView = sidebarComponent.getView();
        const sidebarContainer = sidebarView.getContainer();

        const resultsNumSpan = sidebarContainer.querySelector('.results-number');

        return resultsNumSpan;
    }

    _getQuickLooksCartButton() {

        const sidebarComponent = this.getParentComponent();
        const sidebarView = sidebarComponent.getView();
        const sidebarContainer = sidebarView.getContainer();

        const quickLooksCartButton = sidebarContainer.querySelector('.quicklooks-cart');

        return quickLooksCartButton;
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