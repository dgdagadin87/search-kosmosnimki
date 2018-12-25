import { SearchWidget } from 'scanex-search-input';
import Translations from 'scanex-translations';

import BaseComponent from 'js/base/BaseComponent';

import CrdSearchProvider from './searchProviders/crdProvider/CrdSearchProvider';
import OsmSearchProvider from './searchProviders/osmProvider/OsmSearchProvider';
import GmxSearchProvider from './searchProviders/gmxProvider/GmxSearchProvider';

export default class SearchWidgetComponent extends BaseComponent {

    init() {

        this._initSearchProviders();

        const parentView = this.getParentComponent().getView();

        this._view = new SearchWidget(
            parentView.getSearchPaneRef(),
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

    _initSearchProviders() {

        const application = this.getApplication();
        const map = this.getMap();

        const config = {
            map, application
        };

        this._crdProvider = new CrdSearchProvider(config);
        this._gmxProvider = new GmxSearchProvider(config);
        this._osmProvider = new OsmSearchProvider(config);
    }

    _getSearchProviders() {

        return [
            this._crdProvider.getMain(),
            this._gmxProvider.getMain(),
            this._osmProvider.getMain()
        ];
    }

}