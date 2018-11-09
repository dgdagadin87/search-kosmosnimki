import {getCorrectIndex, getVisibleChangedState, makeCloseTo, splitComplexId, flatten} from '../../utils/commonUtils';
import {normalizeGeometry} from '../../utils/layersUtils';

import {MAX_CART_SIZE} from '../../config/constants/constants';
import {LAYER_ATTRIBUTES} from '../../config/layers/layers';


export default class SnapshotBridgeController {

    constructor(config) {

        const {application, map} = config;

        this._application = application;
        this._map = map;

        this._qlUrl = '//search.kosmosnimki.ru/QuickLookImage.ashx',
        this._qlSize = { width: 600, height: 600 };
    }

    _showQuicklook (gmxId, show) {
        return new Promise(resolve => {
            const application = this.getApplication();
            const appEvents = application.getAppEvents();
            const store = application.getStore();
            const snapshot = store.getData('snapshots', gmxId);

            if (snapshot) {

                const {properties = []} = snapshot;
                const visibleChangedState = getVisibleChangedState(show, properties); // TODO

                if (visibleChangedState) {
                    snapshot['properties'] = properties;
                    store.updateData('snapshots', {id: gmxId, content: snapshot}, ['snapshots:showQuicklookList']);

                    this.showQuicklookOnMap(gmxId, show)
                    .then(() => {                    
                        //this._update_list_item (id, this._compositeLayer.getItem (id));
                        appEvents.trigger('snapshots:showQuicklookList', gmxId);
                        resolve();
                    })
                    .catch(e => console.log(e));
                }
            }
            else {
                console.warn('snapshot with id =', id, ' not found.');
            }
        });
    }

    showQuicklookOnMap(id, isVisible) {

        return new Promise(resolve => {

            const map = this.getMap();
            const application = this.getApplication();
            const appEvents = application.getAppEvents();
            const store = application.getStore();
            const sceneIdIndex = getCorrectIndex('sceneid');
            const platformIndex = getCorrectIndex('platform');
            const clipCoordsIndex = getCorrectIndex('clip_coords');
            const visibleIndex = getCorrectIndex('visibleIndex');
            const x1Index = getCorrectIndex('x1');
            const currentSnapshot = store.getData('snapshots', id);
            let {quicklook, properties = []} = currentSnapshot;

            if (isVisible) {
                if (!quicklook) {/* ... */}
                else {
                    properties[visibleIndex] = 'visible';
                    quicklook.addTo(this._map);
                    //this._vectorLayer.bringToTopItem(id);
                    store.updateData(
                        'snapshots',
                        {id: gmx_id, content: currentSnapshot},
                        ['snapshots:showQuicklookList', 'snapshots:bringToTop']
                    );
                    resolve();
                }
            }
            else {
                if (quicklook) {
                    map.removeLayer(quicklook);
                    currentSnapshot.quicklook = null;
                    store.updateData('snapshots', {id: id, content: currentSnapshot}, ['snapshots:showQuicklookList']);
                }

                appEvents.trigger('snapshots:bringToBottom', id);
                resolve();
            }
        });
    }

    hoverContour(e, state) {

        const application = this.getApplication();
        const store = application.getStore();
        const hoverIndex = getCorrectIndex('hover');

        const {detail} = e;

        let gmxId;
        let mode;

        if (detail === undefined) {
            const { gmx: {id} } = e;
            gmxId = id;
            mode = 'fromMap';
        }
        else {
            const {item: {gmx_id}} = detail;
            gmxId = gmx_id;
            mode = 'fromList';
        }

        const snapshot = store.getData('snapshots', gmxId);

        if (snapshot) {

            const {properties} = snapshot;
        
            properties[hoverIndex] = state;

            snapshot['properties'] = properties;

            let events = [];

            if (mode === 'fromMap') {
                events.push('snapshots:setHovered');
            }
            events.push('snapshots:setHoveredMap');

            store.updateData('snapshots', {id: gmxId, content: snapshot}, events);
        }
        else {
            window.console.warn(`${gmxId} - undefined`);
        }
    }

    zoomToContourOnMap(e) {

        const {detail: {item: {gmx_id: gmxId}}} = e;

        const application = this.getApplication();
        const appEvents = application.getAppEvents();

        appEvents.trigger('snapshots:zoomMap', gmxId);

        // ... show ql ... //
    }

    showQuicklookOnListAndMap(e) {

        const {gmx_id: gmxId} = e.detail;
        const application = this.getApplication();
        const store = application.getStore();
        const visibleIndex = getCorrectIndex('visible');
        const currentSnapshot = store.getData('snapshots', gmxId);
        const {properties = []} = currentSnapshot;
        const visible = properties[visibleIndex];

        let showState = false;

        switch (visible) {
            case 'visible':
            case 'loading':
                showState = false;
                break;                
            case 'hidden':
            default:
                showState = true;
                break;
        }

        this._showQuicklook(gmxId, showState);
    }

    setSelectedOnListAndMap(e) {

        const application = this.getApplication();
        const store = application.getStore();
        const selectedIndex = getCorrectIndex('selected');

        const {detail: {gmx_id: gmxId}} = e;
        let item = store.getData('snapshots', gmxId);

        let {properties} = item;

        if (properties) {
            properties[selectedIndex] = !properties[selectedIndex];
        }
        item['properties'] = properties;

        store.updateData(
            'snapshots',
            {id: gmxId, content: item},
            [
                'snapshots:setSelected',
                'snapshots:setSelectedMap'
            ]
        );
    }

    setAllSelectedOnListAndMap() {

        const application = this.getApplication();
        const store = application.getStore();

        const selectedIndex = getCorrectIndex('selected');
        const cartIndex = getCorrectIndex('cart');
        const gmxIdIndex = getCorrectIndex('gmx_id');

        const data = store.getSerializedData('snapshots');
        const cartData = data.filter(item => item['properties'][cartIndex]);

        const selectedState = !cartData.every(item => item['properties'][selectedIndex]);

        const dataToUpdate = cartData.map(item => {
            const {properties} = item;
            const gmxId = properties[gmxIdIndex];
            properties[selectedIndex] = selectedState;
            item['properties'] = properties;
            return {
                id: gmxId,
                content: item
            }
        });

        store.updateData(
            'snapshots',
            dataToUpdate,
            [
                'snapshots:setAllSelected',
                'snapshots:setAllSelectedMap'
            ]
        );
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

        const { gmx_id: gmxId } = e.detail;
        let item = store.getData('snapshots', gmxId);

        let {properties} = item;
        let isCart = properties[cartIndex];

        if (filteredAllData.length + 1 > MAX_CART_SIZE && !isCart) {
            appEvents.trigger('sidebar:cart:limit');
            return;
        }

        if (properties) {
            properties[cartIndex] = !isCart;
            properties[selectedIndex] = true;
        }
        item['properties'] = properties;

        store.updateData(
            'snapshots',
            {id: gmxId, content: item},
            [
                'snapshots:addToCart',
                'snapshots:addToCartMap'
            ]);
    }

    addAllToCartOnListAndMap() {

        const application = this.getApplication();
        const appEvents = application.getAppEvents();
        const store = application.getStore();

        const cartIndex = getCorrectIndex('cart');
        const selectedIndex = getCorrectIndex('selected');

        const rawData = store.getData('snapshots');
        const dataArray = Object.keys(rawData).map(itemId => rawData[itemId]);

        const areSomeNotInCart = dataArray.some(item => {
            const {properties} = item;
            return properties[cartIndex] === false;
        });

        if (areSomeNotInCart && dataArray.length > MAX_CART_SIZE) {
            appEvents.trigger('sidebar:cart:limit');
            return;
        }

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

        store.rewriteData(
            'snapshots',
            dataToRewrite,
            [
                'snapshots:addAllToCart',
                'snapshots:addAllToCartMap',
            ]
        );
    }

    removeSelectedFavoritesFromListAndMap() {

        const application = this.getApplication();
        const store = application.getStore();

        const selectedIndex = getCorrectIndex('selected');
        const cartIndex = getCorrectIndex('cart');
        const gmxIdIndex = getCorrectIndex('gmx_id');

        const data = store.getSerializedData('snapshots');
        const cartData = data.filter(item => item['properties'][cartIndex] && item['properties'][selectedIndex]);

        if (cartData.length < 1) {
            return;
        }

        const dataToUpdate = cartData.map(item => {
            const {properties} = item;
            const gmxId = properties[gmxIdIndex];
            properties[cartIndex] = false;
            properties[selectedIndex] = false;
            item['properties'] = properties;
            return {
                id: gmxId,
                content: item
            }
        });

        store.updateData(
            'snapshots',
            dataToUpdate,
            [
                'snapshots:removeSelectedFavorites',
                'snapshots:removeSelectedFavoritesMap'
            ]
        );
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

        let idsToRemove = [];
        dataToRemove.forEach(([id]) => {
            // ... delete quicklook layer from map ... //
            idsToRemove.push(id);
        });

        store.removeData(
            'snapshots',
            idsToRemove,
            [
                'snapshots:researched',
                'snapshots:researchedMap'
            ]
        )

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

        store.rewriteData(
            'snapshots',
            resultsForAdding,
            [
                'snapshots:researchedMap',
                'snapshots:researched'
                
            ]
        );
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