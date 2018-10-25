import {
    getCorrectIndex
} from '../../utils/commonUtils';
import {
    normalizeGeometry
} from '../../utils/layersUtils';

import {
    LAYER_ATTRIBUTES,
    LAYER_ATTR_TYPES
} from '../../config/layers/layers';


export default class SnapshotBridgeController {

    constructor(config) {

        const {application, map} = config;

        this._application = application;
        this._map = map;
    }

    clearSnapShotsOnResults() {

        const resultIndex = getCorrectIndex('result');
        const cartIndex = getCorrectIndex('cart');

        const application = this.getApplication();
        const store = application.getStore();

        const snapShotsData = store.getData('snapshots');
        const keysToRemove = Object.keys(snapShotsData);
        const dataToRemove = keysToRemove.reduce(
            (data, gmxId) => {
                const {properties} = snapShotsData[gmxId];
                if (properties[cartIndex]) {
                    properties[resultIndex] = false;
                }
                else {
                    data.push([id]);
                }            
                return data;
            }
        );

        this._vectorLayer.removeData(toRemove);
        toRemove.forEach(([id]) => {
            let {quicklook} = this._vectors[id];
            if(quicklook) {
                this._map.removeLayer(quicklook);
            }
            delete this._vectors[id];
        });
    }

    addContoursOnMapAndList(result) {

        const application = this.getApplication();
        const store = application.getStore();

        const {fields, values = []} = result;

        const gmxIdPosition = fields.indexOf('gmx_id');

        let contours = values.reduce((preparedContours, properties) => {

            const propertiesLastIndex = properties.length - 1;

            const geometryToGeoJson = L.gmxUtil.geometryToGeoJSON(properties[propertiesLastIndex], true, true);
            const clipCoords = normalizeGeometry(geometryToGeoJson);

            let value = LAYER_ATTRIBUTES.reduce((contourData, attrKey) => {

                const index = fields.indexOf(attrKey);

                if (index < 0) {
                    switch (attrKey) {
                        case 'hover':                            
                        case 'selected':                        
                        case 'cart':
                            contourData.push(false);
                            break;
                        case 'result':
                            contourData.push(true);                        
                            break;
                        case 'acqtime':
                            contourData.push(null);
                            break;
                        case 'visible':
                            contourData.push('hidden');
                            break;
                        case 'clip_coords':
                            contourData.push(clipCoords);
                            break;
                        default:
                            break;
                    }
                }
                else {
                    switch (attrKey) {
                        case 'visible':
                            if (typeof properties[index] === 'boolean') {
                                contourData.push(properties[index] ? 'visible' : 'hidden');
                            }
                            else {
                                contourData.push(properties[index]);
                            }
                            break;
                        case 'clip_coords':
                            contourData.push(clipCoords);
                            break;                      
                        default:
                            contourData.push(properties[index]);
                            break;
                    }                   
                } 
                return contourData;               
            }, []);
            value.unshift(properties[gmxIdPosition]);            
            value.push(properties[propertiesLastIndex]);
            preparedContours.push(value);            
            return preparedContours;
        },[]);        
        
        const resultsForAdding = contours.map(item => {

            const gmxId = item[0];

            return {
                id: gmxId,
                content: item
            };
        });

        store.rewriteData('snapshots', resultsForAdding, ['snapshots:researched']);

        /*this._vectors = this._mergeResults (this._vectors, vectors);
        this._vectorLayer.removeData();
        let items = serialize(this._vectors).map(({properties}) => properties);
        this._vectorLayer.addData(items);*/
        console.log(store);
    }

    getApplication() {

        return this._application;
    }

    getMap() {

        return this._map;
    }

}