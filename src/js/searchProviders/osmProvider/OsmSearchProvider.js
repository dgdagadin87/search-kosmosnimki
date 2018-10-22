import { OsmDataProvider } from 'scanex-search-input';

import {NON_EDIT_LINE_STYLE} from '../../config/constants/constants';

import {normalizeGeometry} from '../../utils/layersUtils';

import BaseSearchProvider from '../../base/BaseSearchProvider';


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

        const map = this.getMap();

        const application = this.getApplication();
        const appEvents = application.getAppEvents();

        const results = e.detail;

        const features = results.map(x => {
            x.feature.properties.editable = false;
            x.feature.properties.name = x.feature.properties.ObjName;
            return x.feature;
        });

        const {fill, weight, opacity} = NON_EDIT_LINE_STYLE;

        if (features && features.length) {
            features.map(geoJSON => {

                normalizeGeometry(geoJSON.geometry);

                let [object] = map.gmxDrawing.addGeoJSON(
                    geoJSON,
                    {
                        editable: false,
                        lineStyle: { fill, weight, opacity },
                        className: 'osm-layer'
                    }
                );

                appEvents.trigger('drawingObjects:addDrawingOnList', {object, geoJSON});
                object.bringToBack();
            });

            const json = features.reduce((a, geojson) => {
                a.addData(geojson.geometry);
                return a;
            }, L.geoJson());

            const bounds = json.getBounds();

            map.fitBounds(bounds);
            // map.invalidateSize();
        }
    }

}