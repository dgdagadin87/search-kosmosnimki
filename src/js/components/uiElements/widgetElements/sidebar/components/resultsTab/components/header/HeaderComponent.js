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
        const events = application.getServiceEvents();
        const store = application.getStore();
        const clearButton = this._getClearResultsButton();
        const qlCartButton = this._getQuickLooksCartButton();
        const qqq = this._view._main.querySelector('#qqqqq');

        store.on('contours:researchedList', this._onStoreResearchHandler.bind(this));
        store.on('contours:showQuicklookList', this._setQuickLooksCartState.bind(this));

        events.on('contours:showQuicklookList', this._setQuickLooksCartState.bind(this));

        clearButton.addEventListener('click', () => this.events.trigger('results:clear'));
        qlCartButton.addEventListener('click', () => this.events.trigger('results:setVisibleToFavorites'));
        qqq.addEventListener('click', () => {
            const app = this.getApplication();
            const store = app.getStore();
            const a = store.getResults();

            const d = [];
            for (var i = 0; i < 200; i++) {
                if (i === 200 || i === a.length) break;
                let f = a[i];
                f['properties'][getCorrectIndex('cart')] = true;
                let id = f['properties'][getCorrectIndex('gmx_id')]

                d.push({
                    id, content: f
                });
            }

            store.updateData('contours', d, ['contours:addVisibleToFavoritesList']);
        });
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