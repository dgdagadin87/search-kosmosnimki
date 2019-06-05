import BaseComponent from 'js/base/BaseComponent';

import View from './view/View.html';

import { getProperty } from 'js/application/searchDataStore/SearchDataStore';


export default class TableHeaderComponent extends BaseComponent {

    init() {

        this._view = new View({
            target: document.querySelector('#map div.leaflet-control div.panes div.results-pane')
        });

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const store = application.getStore();
        const view = this.getView();
        const ContourController = application.getBridgeController('contour');

        store.on('contours:researchedListHeader', this._onSetSatellites.bind(this));
        store.on('contours:startResearchedListHeader', this._onSetSatellites.bind(this));
        store.on('clientFilter:clear', this._onClearFilter.bind(this));
        view.on('setSorted', this._onSetSorted.bind(this));
        view.on('changeClientFilter', (e) => this.events.trigger('filter:change', e));
        view.on('addAllToCart', () => ContourController.addAllToCartOnListAndMap());
    }

    _onSetSorted(data) {

        this.events.trigger('sortGrid', data);
    }

    _onClearFilter() {

        const application = this.getApplication();
        const store = application.getStore();
        const view = this.getView();

        const {clouds, angle, date} = store.getData('searchCriteria');

        const clearedFilter = {
            isChanged: false,
            filterData: {
                unChecked: [],
                clouds,
                angle,
                date
            }
        };

        view.clearFilter({ clientFilter: clearedFilter });
    }

    _onSetSatellites() {

        const application = this.getApplication();
        const store = application.getStore();
        const view = this.getView();

        const results = store.getResults();
        const {satellites, clouds, angle, date} = store.getData('searchCriteria');

        const clearedFilter = {
            isChanged: false,
            filterData: {
                unChecked: [],
                clouds,
                angle,
                date
            }
        };

        let resultPlatforms = [];
        results.forEach(item => {
            const platform = getProperty(item, 'platform');
            if (resultPlatforms.indexOf(platform) === -1) {
                resultPlatforms.push(platform);
            }
        });

        let correctSatellites = [];
        satellites.ms.forEach(item => {
            //console.log(item.name, item.platforms)
            const hasInResults = item.platforms.some(item => resultPlatforms.indexOf(item) !== -1);
            item.checked && hasInResults && correctSatellites.push(item);
        });
        satellites.pc.forEach(item => {
            //console.log(item.name, item.platforms)
            const hasInResults = item.platforms.some(item => resultPlatforms.indexOf(item) !== -1);
            item.checked && hasInResults && correctSatellites.push(item);
        });

        view.setData({
            satellites: correctSatellites,
            clientFilter: clearedFilter
        });
    }

}