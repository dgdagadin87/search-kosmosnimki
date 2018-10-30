import {
    getCorrectIndex
} from '../../utils/commonUtils';
import {
    normalizeGeometry
} from '../../utils/layersUtils';

import {
    CART_LIMIT_SIZE
} from '../../config/constants/constants';
import {
    LAYER_ATTRIBUTES
} from '../../config/layers/layers';


export default class SnapshotBridgeController {

    constructor(config) {

        const {application, map} = config;

        this._application = application;
        this._map = map;
    }

    hoverContourOnMap(e, state) {

        //console.log(e.detail);
        //console.log('HOVERED', state);
    }

    zoomToContourOnMap(e) {

        //console.log(e.detail);
        //console.log('ZOOMED');
    }

    showQuicklookOmListAndMap(e) {

        //console.log(e.detail);
        //console.log('VISIBLED');
    }

    addToCartOnListAndMap(e) {

        const application = this.getApplication();
        const appEvents = application.getAppEvents();
        const store = application.getStore();

        const cartIndex = getCorrectIndex('cart');
        const selectedIndex = getCorrectIndex('selected');

        const allData = store.getSerializedData('snapshots');
        const filteredAllData = allData.filter(item => {
            const {properties} = item;
            return properties[cartIndex];
        });

        if (filteredAllData.length + 1 > CART_LIMIT_SIZE) {
            appEvents.trigger('sidebar:cart:limit');
            return;
        }

        const { gmx_id: gmxId } = e.detail;
        let item = store.getData('snapshots', gmxId);

        let {properties} = item;
        if (properties) {
            properties[cartIndex] = !properties[cartIndex];
            properties[selectedIndex] = true;
        }
        item['properties'] = properties;

        store.updateData('snapshots', {id: gmxId, content: item}, ['snapshots:addToCart']);
        
        // ... redraw contour on map ... //
    }

    addAllToCartOnListAndMap() {

        const application = this.getApplication();
        const store = application.getStore();

        const cartIndex = getCorrectIndex('cart');
        const selectedIndex = getCorrectIndex('selected');

        const rawData = store.getData('snapshots');
        const dataArray = Object.keys(rawData).map(itemId => rawData[itemId]);

        const areSomeNotInCart = dataArray.some(item => {
            const {properties} = item;
            return properties[cartIndex] === false;
        });

        const dataToRewrite = Object.keys(rawData).map(
            (gmxId) => {
                let item = rawData[gmxId];
                let {properties} = item;
                properties[cartIndex] = areSomeNotInCart;
                properties[selectedIndex] = areSomeNotInCart;

                item['properties'] = properties;

                return {
                    id: gmxId,
                    content: item
                };
            }
        );

        store.rewriteData('snapshots', dataToRewrite, ['snapshots:addAllToCart']);

        // ... redraw contours on map ... //
    }

    clearSnapShotsOnResults() {

        const application = this.getApplication();
        const store = application.getStore();

        const resultIndex = getCorrectIndex('result');
        const cartIndex = getCorrectIndex('cart');

        const snapShotsData = store.getData('snapshots');
        const keysToRemove = Object.keys(snapShotsData);

        if (keysToRemove.length < 1) {
            return;
        }

        // remove only results, not favourites
        const dataToRemove = keysToRemove.reduce(
            (data, gmxId) => {
                const {properties} = snapShotsData[gmxId];
                if (properties[cartIndex]) {
                    properties[resultIndex] = false;
                }
                else {
                    data.push([gmxId]);
                }
                return data;
            },
        []);

        // ... remove Contours from map ... //

        let idsToRemove = [];
        dataToRemove.forEach(([id]) => {
            // ... delete quicklook layer from map ... //
            idsToRemove.push(id);
        });

        store.removeData('snapshots', idsToRemove, ['snapshots:researched'])
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

        const oldData = store.getData('snapshots');
        const mergedData = this._mergeResults(oldData, contours);

        const resultsForAdding = Object.keys(mergedData).map(gmxId => {

            const item = mergedData[gmxId];

            return {
                id: gmxId,
                content: item
            };
        });

        store.rewriteData('snapshots', resultsForAdding, ['snapshots:researched']);

        // ... remove and add data on map ... //
    }

    getApplication() {

        return this._application;
    }

    getMap() {

        return this._map;
    }

    _mergeResults (old, data) {

        const resultIndex = getCorrectIndex('result');

        const cache = Object.keys(old).reduce((a,id) => {
            a[id] = a[id] || {properties: [], quicklook: null};
            a[id].properties = old[id].properties;
            return a;
        }, {});

        return data.reduce((a,value) => {
            const id = value[0];
            if (cache[id]){
                cache[id].properties[resultIndex] = true;
            }
            else {
                a[id] = a[id] || {properties: [], quicklook: null};
                a[id].properties = value;
            }
            return a;
        }, cache);
    }

}