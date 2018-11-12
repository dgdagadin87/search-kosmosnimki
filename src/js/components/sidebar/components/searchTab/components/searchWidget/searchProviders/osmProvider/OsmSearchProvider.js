import { OsmDataProvider } from 'scanex-search-input';

import BaseSearchProvider from '../base/BaseSearchProvider';


export default class OsmSearchProvider extends BaseSearchProvider {

    constructor(props) {

        super(props);

        this._provider = new OsmDataProvider({
            showOnMap: false,
            serverBase: '//maps.kosmosnimki.ru',
            suggestionLimit: 10
        });

        this._bindEvents();
    }

    _bindEvents() {

        this._provider.addEventListener ('fetch', this._onFetchHandler.bind(this));
    }

    _onFetchHandler(e) {

        const results = e.detail;

        const application = this.getApplication();
        const DrawingBridgeController = application.getBridgeController('drawing');

        DrawingBridgeController.addDrawingOnMapAndListFromOsm(results);
    }

}