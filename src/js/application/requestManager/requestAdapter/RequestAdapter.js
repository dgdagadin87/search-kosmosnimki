import {LAYER_ID} from 'js/config/constants/Constants';
import {splitOn180} from 'js/utils/CommonUtils';

import AdapterCore from './_core/AdapterCore';


export default class RequestAdapter {

    constructor({ application, gmxResourceServer }) {

        this._application = application;

        this._core = new AdapterCore({
            layer: LAYER_ID,
            gmxResourceServer,
            application: this._application
        });
    }

    _getGeometries() {

        const map = this._application.getMap();
        const store = this._application.getStore();
        const drawingObjects = store.getData('drawings');

        const drawingKeys = Object.keys(drawingObjects);
        const drawings = drawingKeys.map(id => {
            return drawingObjects[id]
        });

        let geometries;

        if (drawings.length > 0) {

            const visibleDrawings = drawings.filter(obj => obj.visible);

            const preparedGeoJsonDrawings = visibleDrawings.reduce(
                (drawingsArray, {geoJSON}) => {
                    return drawingsArray.concat(geoJSON.geometry)
                },
            []);
        
            geometries = preparedGeoJsonDrawings.reduce(
                (drawingsArray, geometry) => {
                    return drawingsArray.concat(splitOn180(geometry));
                },
            []);
        }
        else {

            const bounds = map.getBounds();
            const nw = bounds.getNorthWest();
            const ne = bounds.getNorthEast();
            const se = bounds.getSouthEast();
            const sw = bounds.getSouthWest();

            geometries = [{
                type: 'Polygon',
                coordinates: [[
                    [nw.lng, nw.lat],
                    [ne.lng, ne.lat],
                    [se.lng, se.lat],
                    [sw.lng, sw.lat],
                    [nw.lng, nw.lat],
                ]]
            }];
        }

        return geometries;
    }

    searchContours(limit = 0) {

        const store = this._application.getStore();
        const searchCriteria = store.getData('searchCriteria');
        const userInfo = store.getData('userInfo');

        const core = this.getCore();

        if (userInfo['IsAuthenticated'] && userInfo['Role'] === 'scanex') {
            const satellitesIds = ['WV04', 'WV03', 'WV02', 'WV01', 'GE01', 'IK'];
            searchCriteria['satellites']['ms'] = searchCriteria['satellites']['ms'].filter(item => satellitesIds.indexOf(item.id) === -1);
            searchCriteria['satellites']['pc'] = searchCriteria['satellites']['pc'];
        }

        core.criteria = searchCriteria;
        core.geometries = this._getGeometries();

        return core.search(limit);
    }

    getCore() {

        return this._core;
    }

}