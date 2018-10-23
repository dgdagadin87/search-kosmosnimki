import { SearchWidget } from 'scanex-search-input';

import Translations from 'scanex-translations';

import BaseComponent from '../../../../../../base/BaseComponent';


export default class SearchWidgetComponent extends BaseComponent {

    init() {

        this._searchContainer = this.getParentComponent().getView()._container;

        this._view = new SearchWidget(
            this._searchContainer.querySelector('.search-pane'),
            {
                placeHolder: Translations.getText('controls.search'),
                suggestionLimit: 10,
                providers: this._getSearchProviders(),
                replaceInputOnEnter: true,
                style: {
                    editable: false,
                    map: true,
                    pointStyle: {
                        size: 8,
                        weight: 1,
                        opacity: 1,
                        color: '#00008B'
                    },
                    lineStyle: {
                        fill: false,
                        weight: 3,
                        opacity: 1,
                        color: '#008B8B'
                    }
                },
        });

        this._bindEvents();
    }

    _bindEvents() {

        const map = this.getMap();

        const searchControl = this.getView();

        map.on ('click', searchControl.results.hide.bind(searchControl.results));
        map.on ('dragstart', searchControl.results.hide.bind(searchControl.results));
    }

    _getSearchProviders() {

        const application = this.getApplication();

        return [
            application.getSearchProvider('crdProvider').getMain(),
            application.getSearchProvider('gmxProvider').getMain(),
            application.getSearchProvider('osmProvider').getMain(),
        ];
    }

}