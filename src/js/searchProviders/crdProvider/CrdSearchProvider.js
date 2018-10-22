import { CoordinatesDataProvider } from 'scanex-search-input';

import {getDrawingObject} from '../../utils/layersUtils';

import BaseSearchProvider from '../../base/BaseSearchProvider';


export default class CrdSearchProvider extends BaseSearchProvider {

    constructor(props) {

        super(props);

        this._provider = new CoordinatesDataProvider({showOnMap: false});

        this._bindEvents();
    }

    _bindEvents() {

        this._provider.addEventListener ('fetch', this._onFetchHandler.bind(this));
    }

    _onFetchHandler(e) {

        const map = this.getMap();
        const application = this.getApplication();

        const result = e.detail;            
        let geoJSON = result.feature;

        geoJSON.properties.editable = false;

        const center = L.GeoJSON.coordsToLatLng(geoJSON.geometry.coordinates);            
        const item = getDrawingObject({geoJSON, editable: geoJSON.properties.editable});

        const gatewayBetweenMapAndUI = application.getGateway();
        
        gatewayBetweenMapAndUI.addDrawingObjectOnMapAndUi(item);
        //const drawing = window.Catalog.resultsController.addDrawing (item);

        map.setView(center, 14);
        // map.invalidateSize();
    }

}