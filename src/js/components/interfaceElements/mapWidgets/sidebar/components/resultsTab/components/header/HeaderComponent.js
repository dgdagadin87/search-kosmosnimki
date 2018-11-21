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
        const store = application.getStore();
        const clearButton = this._getClearResultsButton();

        store.on('contours:researched', this._onStoreResearchHandler.bind(this));
        clearButton.addEventListener('click', () => this.events.trigger('results:clear'));
    }

    _onStoreResearchHandler() {

        const application = this.getApplication();
        const store = application.getStore();
        const visibleIndex = getCorrectIndex('visible');
        const allResults = store.getResults();
        const visibleResults = allResults.filter(item => item['properties'][visibleIndex]);

        const allLength = allResults.length;
        const visibleLength = visibleResults.length;

        this._updateResultsNumber(allLength);
        this._updateQuickLooksCartButton(visibleLength);
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

    _updateQuickLooksCartButton(number) {

        const view = this.getView();

        view.updateQuickLooksCartButton(number);
    }

}