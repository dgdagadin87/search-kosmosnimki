import BaseComponent from 'js/base/BaseComponent';

import View from './view/View';

import { getProperty } from 'js/application/searchDataStore/SearchDataStore';


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
        const events = application.getServiceEvents();
        const store = application.getStore();
        const clearFilterSpan = this._getClearFilterSpan();
        const clearButton = this._getClearResultsButton();
        const qlCartButton = this._getQuickLooksCartButton();

        store.on('contours:researchedList', this._onStoreResearchHandler.bind(this));
        store.on('contours:startResearchedList', this._onStoreResearchHandler.bind(this));
        store.on('contours:showQuicklookList', this._setQuickLooksCartState.bind(this));
        store.on('clientFilter:changeList', this._updateClearFilterSpan.bind(this));
        store.on('clientFilter:changeList', this._updateFilteredNumber.bind(this));

        events.on('contours:showQuicklookList', this._setQuickLooksCartState.bind(this));

        clearFilterSpan.addEventListener('click', () => this.events.trigger('filter:clear'));
        clearButton.addEventListener('click', () => this.events.trigger('results:clear'));
        qlCartButton.addEventListener('click', () => this.events.trigger('results:setVisibleToFavorites'));
    }

    _onStoreResearchHandler() {

        const application = this.getApplication();
        const store = application.getStore();

        const allResults = store.getResults();
        const isVisibleResults = allResults.some(item => getProperty(item, 'visible') === 'visible');
        const allLength = allResults.length;

        this._updateFilteredResultsNumber(allLength);
        this._updateAllResultsNumber(allLength);
        this._updateQuickLooksCartButton(isVisibleResults);
    }

    _setQuickLooksCartState() {

        const application = this.getApplication();
        const store = application.getStore();

        const allResults = store.getResults();
        const isVisibleResults = allResults.some(item => getProperty(item, 'visible') === 'visible');

        this._updateQuickLooksCartButton(isVisibleResults);
    }

    _getClearFilterSpan() {

        const view = this.getView();

        return view.getClearFilterSpan();
    }

    _getQuickLooksCartButton() {

        const view = this.getView();

        return view.getQuickLooksCartButton();
    }

    _getClearResultsButton() {

        const view = this.getView();

        return view.getClearResultsButton();
    }

    _updateClearFilterSpan() {

        const application = this.getApplication();
        const store = application.getStore();
        const {isChanged} = store.getData('clientFilter');
        const view = this.getView();

        view.updateClearFilterSpan(isChanged);
    }

    _updateFilteredNumber() {

        const application = this.getApplication();
        const store = application.getStore();
        const {isChanged} = store.getData('clientFilter');
        const filteredResults = store[isChanged ? 'getFilteredResults' : 'getResults']();

        this._updateFilteredResultsNumber(filteredResults.length);
    }

    _updateFilteredResultsNumber(number) {

        const view = this.getView();

        view.updateFilteredResultsNumber(number);
    }

    _updateAllResultsNumber(number) {

        const view = this.getView();

        view.updateAllResultsNumber(number);
    }

    _updateQuickLooksCartButton(hasVisible) {

        const view = this.getView();

        view.updateQuickLooksCartButton(hasVisible);
    }

}