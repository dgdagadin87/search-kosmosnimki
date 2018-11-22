import BaseBridgeController from 'js/base/BaseBridgeController';

import {
    getCorrectIndex,
    getVisibleChangedState,
    makeCloseTo,
    splitComplexId,
    flatten,
    normalizeGeometry
} from 'js/utils/commonUtils';

import {MAX_CART_SIZE, LAYER_ATTRIBUTES, QUICKLOOK} from 'js/config/constants/constants';


export default class ContourBridgeController extends BaseBridgeController {

    _showQuicklook (gmxId, show) {
        return new Promise(resolve => {
            const application = this.getApplication();
            const appEvents = application.getAppEvents();
            const store = application.getStore();
            const contour = store.getData('contours', gmxId);

            if (contour) {

                const {properties = []} = contour;
                const visibleChangedState = getVisibleChangedState(show, properties); // TODO

                if (visibleChangedState) {
                    contour['properties'] = properties;
                    store.updateData('contours', {id: gmxId, content: contour}, ['contours:showQuicklookOnList']);

                    this.showQuicklookOnMap(gmxId, show)
                    .then(() => {
                        appEvents.trigger('contours:showQuicklookOnList', gmxId);
                        resolve();
                    })
                    .catch(e => console.log(e));
                }
            }
            else {
                console.warn('contour with id =', id, ' not found.');
            }
        });
    }

    showQuicklookOnMap(id, isVisible) {

        return new Promise(resolve => {

            const map = this.getMap();
            const application = this.getApplication();
            const appEvents = application.getAppEvents();
            const store = application.getStore();
            const gmxIdIndex = getCorrectIndex('gmx_id');
            const sceneIdIndex = getCorrectIndex('sceneid');
            const platformIndex = getCorrectIndex('platform');
            const clipCoordsIndex = getCorrectIndex('clip_coords');
            const visibleIndex = getCorrectIndex('visible');
            const x1Index = getCorrectIndex('x1');
            let currentContour = store.getData('contours', id);
            let {quicklook, properties = []} = currentContour;

            if (isVisible) {

                if (!quicklook) {
                    
                    const sceneid = splitComplexId(properties[sceneIdIndex]).id;
                    const platform = properties[platformIndex];
                    const {url, width, height} = QUICKLOOK;
                    const imageUrl = `${url}?sceneid=${sceneid}&platform=${platform}&width=${width}&height=${height}`;
                    const {lng} = map.getCenter();
                    const clipCoords = normalizeGeometry(properties[clipCoordsIndex], lng);
                    const [ x1,y1, x2,y2, x3,y3, x4,y4 ] = properties.slice(x1Index, x1Index + 8);
                    const anchors = [
                        [makeCloseTo(lng, x1),y1],
                        [makeCloseTo(lng, x2),y2],
                        [makeCloseTo(lng, x3),y3],
                        [makeCloseTo(lng, x4),y4]
                    ];

                    quicklook = L.imageTransform(imageUrl, flatten(anchors, true), { 
                        clip: clipCoords,
                        disableSetClip: true,
                        pane: 'tilePane'
                    });                    
                    quicklook.on('load', () => {
                        const gmxId = properties[gmxIdIndex];
                        properties[visibleIndex] = 'visible';
                        currentContour = { ...currentContour, properties };
                        store.updateData(
                            'contours',
                            {id: gmxId, content: currentContour},
                            ['contours:showQuicklookOnList', 'contours:bringToTop']
                        );
                        resolve();
                    });
                    quicklook.on('error', () => {
                        const gmxId = properties[gmxIdIndex];
                        properties[visibleIndex] = 'failed';
                        map.removeLayer(quicklook);
                        if (currentContour) {
                            currentContour = { ...currentContour, properties, quicklook: null };
                            store.updateData('contours', {id: gmxId, content: currentContour}, ['contours:showQuicklookOnList']);
                        }
                        resolve();
                    });

                    quicklook.addTo(map);
                    currentContour = { ...currentContour, properties, quicklook };
                    store.updateData('contours', {id , content: currentContour}, ['contours:showQuicklookOnList']);
                }
                else {
                    properties[visibleIndex] = 'visible';
                    quicklook.addTo(map);

                    currentContour = { ...currentContour, properties, quicklook };
                    store.updateData('contours', {id, content: currentContour}, ['contours:bringToTop']);
                    resolve();
                }
            }
            else {
                if (quicklook) {
                    map.removeLayer(quicklook);
                    currentContour.quicklook = null;
                    store.updateData('contours', {id, content: currentContour}, [/*'contours:showQuicklookOnList'*/]);
                }

                appEvents.trigger('contours:bringToBottom', id);
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

        const contour = store.getData('contours', gmxId);

        if (contour) {

            const {properties} = contour;
        
            properties[hoverIndex] = state;

            contour['properties'] = properties;

            let events = [];

            if (mode === 'fromMap') {
                events.push('contours:setHovered');
            }
            events.push('contours:setHoveredMap');

            store.updateData('contours', {id: gmxId, content: contour}, events);
        }
        else {
            window.console.warn(`${gmxId} - undefined`);
        }
    }

    zoomToContourOnMap(e) {

        const {detail: {item: {gmx_id: gmxId}}} = e;

        const application = this.getApplication();
        const appEvents = application.getAppEvents();

        appEvents.trigger('contours:zoomMap', gmxId);

        const event = {detail: {gmx_id: gmxId}};
        this.showQuicklookOnListAndMap(event);
    }

    showQuicklookOnListAndMap(e) {

        const {gmx_id: gmxId} = e.detail;
        const application = this.getApplication();
        const store = application.getStore();
        const visibleIndex = getCorrectIndex('visible');
        const currentContour = store.getData('contours', gmxId);
        const {properties = []} = currentContour;
        const visible = properties[visibleIndex];

        if (visible === 'loading') {
            return;
        }

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
        let item = store.getData('contours', gmxId);

        let {properties} = item;

        if (properties) {
            properties[selectedIndex] = !properties[selectedIndex];
        }
        item['properties'] = properties;

        store.updateData(
            'contours',
            {id: gmxId, content: item},
            [
                'contours:setSelected',
                'contours:setSelectedMap'
            ]
        );
    }

    setAllSelectedOnListAndMap() {

        const application = this.getApplication();
        const store = application.getStore();

        const selectedIndex = getCorrectIndex('selected');
        const cartIndex = getCorrectIndex('cart');
        const gmxIdIndex = getCorrectIndex('gmx_id');

        const data = store.getSerializedData('contours');
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
            'contours',
            dataToUpdate,
            [
                'contours:setAllSelected',
                'contours:setAllSelectedMap'
            ]
        );
    }

    addToCartOnListAndMap(e) {

        const application = this.getApplication();
        const appEvents = application.getAppEvents();
        const store = application.getStore();

        const cartIndex = getCorrectIndex('cart');
        const selectedIndex = getCorrectIndex('selected');

        const allData = store.getSerializedData('contours');
        const filteredAllData = allData.filter(item => {
            const {properties} = item;
            return properties[cartIndex];
        });

        const { gmx_id: gmxId } = e.detail;
        let item = store.getData('contours', gmxId);

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
            'contours',
            {id: gmxId, content: item},
            [
                'contours:addToCart',
                'contours:addToCartMap'
            ]);
    }

    addAllToCartOnListAndMap() {

        const application = this.getApplication();
        const appEvents = application.getAppEvents();
        const store = application.getStore();

        const cartIndex = getCorrectIndex('cart');
        const selectedIndex = getCorrectIndex('selected');

        const rawData = store.getData('contours');
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
            'contours',
            dataToRewrite,
            [
                'contours:addAllToCart',
                'contours:addAllToCartMap',
            ]
        );
    }

    removeSelectedFavoritesFromListAndMap() {

        const application = this.getApplication();
        const store = application.getStore();

        const selectedIndex = getCorrectIndex('selected');
        const cartIndex = getCorrectIndex('cart');
        const gmxIdIndex = getCorrectIndex('gmx_id');

        const data = store.getSerializedData('contours');
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
            'contours',
            dataToUpdate,
            [
                'contours:removeSelectedFavorites',
                'contours:removeSelectedFavoritesMap'
            ]
        );
    }

    clearSnapShotsOnResults() {

        const application = this.getApplication();
        const store = application.getStore();

        const resultIndex = getCorrectIndex('result');
        const cartIndex = getCorrectIndex('cart');

        const snapShotsData = store.getData('contours');
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
            this.showQuicklookOnMap(id, false);
            idsToRemove.push(id);
        });

        store.removeData(
            'contours',
            idsToRemove,
            [
                'contours:researched',
                'contours:researchedMap'
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

        const oldData = store.getData('contours');
        const mergedData = this._mergeResults(oldData, contours);

        const resultsForAdding = Object.keys(mergedData).map(gmxId => {

            const item = mergedData[gmxId];

            return {
                id: gmxId,
                content: item
            };
        });

        store.rewriteData(
            'contours',
            resultsForAdding,
            [
                'contours:researchedMap',
                'contours:researched'
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