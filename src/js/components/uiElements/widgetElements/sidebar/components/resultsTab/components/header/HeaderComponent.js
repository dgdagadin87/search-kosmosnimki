import BaseComponent from 'js/base/BaseComponent';

import { getCorrectIndex } from 'js/utils/commonUtils';

import View from './view/View';


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
        const appEvents = application.getAppEvents();
        const store = application.getStore();
        const clearButton = this._getClearResultsButton();
        const quickLookCartButton = this._getQuickLooksCartButton();

        store.on('contours:researched', this._onStoreResearchHandler.bind(this));
        store.on('contours:showQuicklookOnList', this._setQuickLooksCartState.bind(this));

        appEvents.on('contours:showQuicklookOnList', this._setQuickLooksCartState.bind(this));

        clearButton.addEventListener('click', () => this.events.trigger('results:clear'));
        quickLookCartButton.addEventListener('click', () => this.events.trigger('results:setVisibleToCart'));
    }

    _onStoreResearchHandler() {

        const application = this.getApplication();
        const store = application.getStore();
        const visibleIndex = getCorrectIndex('visible');

        const allResults = store.getResults();
        const isVisibleResults = allResults.some(item => item['properties'][visibleIndex] === 'visible');
        const allLength = allResults.length;

        this._updateResultsNumber(allLength);
        this._updateQuickLooksCartButton(isVisibleResults);
    }

    _setQuickLooksCartState() {

        const application = this.getApplication();
        const store = application.getStore();
        const visibleIndex = getCorrectIndex('visible');

        const allResults = store.getResults();
        const isVisibleResults = allResults.some(item => item['properties'][visibleIndex] === 'visible');

        this._updateQuickLooksCartButton(isVisibleResults);
    }

    _getResultsNumSpan() {

        const view = this.getView();

        return view.getResultsNumSpan();
    }

    _getQuickLooksCartButton() {

        const view = this.getView();

        return view.getQuickLooksCartButton();
    }

    _getClearResultsButton() {

        const view = this.getView();

        return view.getClearResultsButton();
    }

    _updateResultsNumber(number) {

        const view = this.getView();

        view.updateResultsNumber(number);
    }

    _updateQuickLooksCartButton(hasVisible) {

        const view = this.getView();

        view.updateQuickLooksCartButton(hasVisible);
    }

}