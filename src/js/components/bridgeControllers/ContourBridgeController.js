import BaseBridgeController from 'js/base/BaseBridgeController';

import {
    getCorrectIndex,
    getVisibleChangedState,
    makeCloseTo,
    splitComplexId,
    flatten,
    normalizeGeometry,
    isClientFilterChanged
} from 'js/utils/commonUtils';

import {MAX_CART_SIZE, LAYER_ATTRIBUTES, QUICKLOOK} from 'js/config/constants/constants';


export default class ContourBridgeController extends BaseBridgeController {

    _getCurrentTab() {

        const application = this.getApplication();
        const sidebarUiElement = application.getUiElement('sidebar');
        const sidebarView = sidebarUiElement.getView();

        return sidebarView.getCurrent();
    }

    _showQuicklook (gmxId, show, fromMap = false) {
        return new Promise(resolve => {
            const application = this.getApplication();
            const events = application.getServiceEvents();
            const store = application.getStore();
            const contour = store.getData('contours', gmxId);

            if (contour) {

                const {properties = []} = contour;
                const visibleChangedState = getVisibleChangedState(show, properties); // TODO

                if (visibleChangedState) {
                    contour['properties'] = properties;
                    store.updateData('contours', {id: gmxId, content: contour}, ['contours:showQuicklookList']);

                    if (fromMap) {
                        const currentTab = this._getCurrentTab();
                        events.trigger('contours:scrollToRow', gmxId, currentTab);
                    }

                    this.showQuicklookOnMap(gmxId, show, true)
                    .then(() => {
                        events.trigger('contours:showQuicklookList', gmxId);
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

    showQuicklookOnMap(id, isVisible, single = false, removeQuicklook = false) {

        return new Promise(redrawItemOnList => {

            const map = this.getMap();
            const application = this.getApplication();
            const serviceEvents = application.getServiceEvents();
            const store = application.getStore();
            const visibleIndex = getCorrectIndex('visible');
            const x1Index = getCorrectIndex('x1');
            let currentContour = store.getData('contours', id);
            let {quicklook, properties = []} = currentContour;

            if (isVisible) {

                if (!quicklook) {
                    const sceneIdValue = store.getPropertyValue(currentContour, 'sceneid');
                    const sceneid = splitComplexId(sceneIdValue).id;
                    const platform = store.getPropertyValue(currentContour, 'platform');
                    const {url, width, height} = QUICKLOOK;
                    const imageUrl = `${url}?sceneid=${sceneid}&platform=${platform}&width=${width}&height=${height}`;
                    const {lng} = map.getCenter();
                    const clipCoordsValue = store.getPropertyValue(currentContour, 'clip_coords');
                    const clipCoords = normalizeGeometry(clipCoordsValue, lng);
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
                        const gmxId = store.getPropertyValue(currentContour, 'gmx_id');
                        properties[visibleIndex] = 'visible';
                        currentContour = { ...currentContour, properties };
                        store.updateData('contours', {id: gmxId, content: currentContour},['contours:bringToTop']);
                        redrawItemOnList();
                    });
                    quicklook.on('error', () => {
                        const gmxId = store.getPropertyValue(currentContour, 'gmx_id');
                        properties[visibleIndex] = 'failed';
                        map.removeLayer(quicklook);
                        if (currentContour) {
                            currentContour = { ...currentContour, properties, quicklook: null };
                            let events = ['contours:bringToTop'];
                            if (!single) {
                                events.push('contours:showQuicklookList');
                            }
                            store.updateData('contours', {id: gmxId, content: currentContour}, events);
                        }
                        redrawItemOnList();
                    });

                    quicklook.addTo(map);
                    currentContour = { ...currentContour, properties, quicklook };
                    store.updateData('contours', {id , content: currentContour});
                }
                else {
                    properties[visibleIndex] = 'visible';
                    quicklook.addTo(map);

                    currentContour = { ...currentContour, properties, quicklook };
                    store.updateData('contours', {id, content: currentContour}, ['contours:bringToTop']);
                    redrawItemOnList();
                }
            }
            else {
                if (quicklook) {
                    map.removeLayer(quicklook);
                    if (removeQuicklook) {
                        currentContour.quicklook = null;
                    }
                    store.updateData('contours', {id, content: currentContour});
                }

                serviceEvents.trigger('contours:bringToBottom', id);
                redrawItemOnList();
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
                events.push('contours:setHoveredList');
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
        const events = application.getServiceEvents();

        events.trigger('contours:zoomMap', gmxId);

        const event = {detail: {gmx_id: gmxId}};
        this.showQuicklookOnListAndMap(event);
    }

    showQuicklookOnListAndMap(e, fromMap = false) {

        let gmxId;
        if (!fromMap) {
            const {gmx_id} = e.detail;
            gmxId = gmx_id;
        }
        else {
            let { gmx: {id}} = e;
            gmxId = id;
        }

        const application = this.getApplication();
        const store = application.getStore();
        const currentContour = store.getData('contours', gmxId);
        const visible = store.getPropertyValue(currentContour, 'visible');

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

        this._showQuicklook(gmxId, showState, fromMap);
    }

    showAllQuicklooksOnListAndMap() {

        const application = this.getApplication();
        const events = application.getServiceEvents();
        const store = application.getStore();

        const favoritesData = store.getFavorites();
        const visibleState = favoritesData.some(item => store.getPropertyValue(item, 'visible') === 'hidden');

        store.setMetaItem('updateResults', true);

        let gmxIdList = [];
        favoritesData.forEach(item => {
            const gmxId = store.getPropertyValue(item, 'gmx_id');
            gmxIdList.push(gmxId);
        });

        gmxIdList.forEach(id => {
            const contour = store.getData('contours', id);
            const {properties = []} = contour;
            const visibleChangedState = getVisibleChangedState(visibleState, properties);
            if (visibleChangedState) {
                contour['properties'] = properties;
                store.updateData('contours', {id, content: contour}, ['contours:allQuicklooksList']);
                this.showQuicklookOnMap(id, visibleState, true)
                .then(() => events.trigger('contours:allQuicklooksList', id))
                .catch(e => console.log(e));
            }
        })
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

        const data = store.getSerializedData('contours');
        const cartData = data.filter(item => store.getPropertyValue(item, 'cart'));

        const selectedState = !cartData.every(item => item['properties'][selectedIndex]);

        const dataToUpdate = cartData.map(item => {
            const {properties} = item;
            const gmxId = store.getPropertyValue(item, 'gmx_id');
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
                'contours:setAllSelectedList',
                'contours:setAllSelectedMap'
            ]
        );
    }

    addToCartOnListAndMap(e) {

        const application = this.getApplication();
        const events = application.getServiceEvents();
        const store = application.getStore();
        const cartIndex = getCorrectIndex('cart');
        const selectedIndex = getCorrectIndex('selected');

        const allData = store.getSerializedData('contours');
        const filteredAllData = allData.filter(item => store.getPropertyValue(item, 'cart'));

        const { gmx_id: gmxId } = e.detail;
        let item = store.getData('contours', gmxId);

        let {properties} = item;
        let isCart = store.getPropertyValue(item, 'cart');

        if (filteredAllData.length + 1 > MAX_CART_SIZE && !isCart) {
            events.trigger('sidebar:cart:limit');
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
                'contours:addToCartList',
                'contours:addToCartMap'
            ]
        );
    }

    addAllToCartOnListAndMap() {

        const application = this.getApplication();
        const events = application.getServiceEvents();
        const store = application.getStore();
        const cartIndex = getCorrectIndex('cart');
        const selectedIndex = getCorrectIndex('selected');

        const {isChanged} = store.getData('clientFilter');
        const filteredResults = store[(isChanged ? 'getFilteredResults' : 'getResults')]();
        const notInCartResults = filteredResults.filter(item => !item['properties'][cartIndex]);
        const areSomeNotInCart = notInCartResults.length > 0;
        const favorites = store.getFavorites();

        if (areSomeNotInCart && (notInCartResults.length + favorites.length) > MAX_CART_SIZE) {
            events.trigger('sidebar:cart:limit');
            return;
        }

        const dataToRewrite = filteredResults.map(item => {
            let {properties} = item;
            let gmxId = store.getPropertyValue(item, 'gmx_id');
            properties[cartIndex] = areSomeNotInCart;
            properties[selectedIndex] = areSomeNotInCart;
            item['properties'] = properties;
            return { id: gmxId, content: item };
        });

        store.updateData(
            'contours',
            dataToRewrite,
            [
                'contours:addAllToCartList',
                'contours:addAllToCartMap',
            ]
        );
    }

    removeSelectedFavoritesFromListAndMap() {

        const application = this.getApplication();
        const store = application.getStore();
        const selectedIndex = getCorrectIndex('selected');
        const cartIndex = getCorrectIndex('cart');

        const data = store.getSerializedData('contours');
        const cartData = data.filter(item => store.getPropertyValue(item, 'cart') && store.getPropertyValue(item, 'selected'));

        if (cartData.length < 1) {
            return;
        }

        const dataToUpdate = cartData.map(item => {
            const {properties} = item;
            const gmxId = store.getPropertyValue(item, 'gmx_id');
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
                'contours:removeSelectedFavoritesList',
                'contours:removeSelectedFavoritesMap'
            ]
        );
    }

    setVisibleToCart() {

        const application = this.getApplication();
        const store = application.getStore();
        const cartIndex = getCorrectIndex('cart');
        const selectedIndex = getCorrectIndex('selected');

        const allResults = store.getResults();
        const cartResults = allResults.filter(item => store.getPropertyValue(item, 'cart'));
        const visibleResults = allResults.filter(item => {
            return store.getPropertyValue(item, 'visible') === 'visible' && !store.getPropertyValue(item, 'cart');
        });

        if (visibleResults.length < 1) {
            return;
        }

        if ( (cartResults.length + visibleResults.length) > MAX_CART_SIZE ) {
            appEvents.trigger('sidebar:cart:limit');
            return;
        }

        const dataToUpdate = visibleResults.map(item => {
            const {properties} = item;
            const gmxId = store.getPropertyValue(item, 'gmx_id');
            properties[cartIndex] = true;
            properties[selectedIndex] = true;
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
                'contours:addVisibleToFavoritesList',
                'contours:addVisibleToFavoritesMap'
            ]
        );
    }

    clearContoursOnResults() {

        const application = this.getApplication();
        const store = application.getStore();

        const resultIndex = getCorrectIndex('result');

        const snapShotsData = store.getData('contours');
        const keysToRemove = Object.keys(snapShotsData);

        if (keysToRemove.length < 1) {
            return;
        }

        // remove only results, not favourites
        const dataToRemove = keysToRemove.reduce(
            (data, gmxId) => {
                const item = snapShotsData[gmxId];
                const {properties} = item;
                if (store.getPropertyValue(item, 'cart')) {
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
            this.showQuicklookOnMap(id, false, false, true);
            idsToRemove.push(id);
        });

        store.removeData(
            'contours',
            idsToRemove,
            [
                'contours:researchedList',
                'contours:researchedMap'
            ]
        )

    }

    addContoursOnMapAndList(result, fromApplyingState = false) {

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

        let eventList = [];
        if (!fromApplyingState) {
            eventList.push('contours:researchedMap');
            eventList.push('contours:researchedList');
        }
        else {
            eventList.push('contours:startResearchedMap');
            eventList.push('contours:startResearchedList');
        }

        store.rewriteData('contours', resultsForAdding, eventList);
    }

    clearClientFilter() {

        const application = this.getApplication();
        const store = application.getStore();
        const searchCriteria = store.getData('searchCriteria');
        const {clouds, angle, date} = searchCriteria;

        const dataToRewrite = {
            isChanged: false,
            filterData: {
                unChecked: [],
                clouds,
                angle,
                date
            }
        };

        store.rewriteData('clientFilter', dataToRewrite, ['clientFilter:changeList','clientFilter:changeMap']);
    }

    changeClientFilter(e) {

        const application = this.getApplication();
        const store = application.getStore();
        const searchCriteria = store.getData('searchCriteria');
        const clientFilter = store.getData('clientFilter');
        const {filterData: clientFilterData} = clientFilter;
        const {detail: {name, value}} = e;

        const filterData = {
            ...clientFilterData,
            [name]: value
        };
        const isChanged = isClientFilterChanged(searchCriteria, filterData);

        const dataToRewrite = {
            isChanged: isChanged,
            filterData
        };

        store.rewriteData('clientFilter', dataToRewrite, ['clientFilter:changeList','clientFilter:changeMap']);
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