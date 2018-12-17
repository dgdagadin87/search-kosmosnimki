import BaseBridgeController from 'js/base/BaseBridgeController';

import {
    makeCloseTo,
    splitComplexId,
    flatten,
    normalizeGeometry
} from 'js/utils/commonUtils';
import {
    getProperty,
    setProperty,
    mergeResults,
    propertiesX1Slice,
    isClientFilterChanged,
    getVisibleChangedState,
} from 'js/application/searchDataStore/SearchDataStore';

import {MAX_CART_SIZE, QUICKLOOK} from 'js/config/constants/constants';
import { LAYER_ATTRIBUTES } from 'js/application/searchDataStore/Attributes';


export default class ContourBridgeController extends BaseBridgeController {

    _getCurrentTab() {

        const application = this.getApplication();
        const store = application.getStore();
        const currentTab = store.getMetaItem('currentTab');

        return currentTab;
    }

    hoverContour(e, state) {

        const application = this.getApplication();
        const store = application.getStore();

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

        let contour = store.getData('contours', gmxId);

        if (contour) {
            const changedContour = setProperty(contour, {'hover': state});

            let events = [];

            if (mode === 'fromMap') {
                events.push('contours:setHoveredList');
            }
            events.push('contours:setHoveredMap');

            store.updateData('contours', {id: gmxId, content: changedContour}, events);
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

    setSelectedOnListAndMap(e) {

        const application = this.getApplication();
        const store = application.getStore();

        const {detail: {gmx_id: gmxId}} = e;
        let item = store.getData('contours', gmxId);
        const changedItem = setProperty(item, {'selected': !getProperty(item, 'selected')});

        store.updateData(
            'contours',
            {id: gmxId, content: changedItem},
            [
                'contours:setSelected',
                'contours:setSelectedMap'
            ]
        );
    }

    setAllSelectedOnListAndMap() {

        const application = this.getApplication();
        const store = application.getStore();

        const data = store.getSerializedData('contours');
        const cartData = data.filter(item => getProperty(item, 'cart'));

        const selectedState = !cartData.every(item => getProperty(item, 'selected'));

        const dataToUpdate = cartData.map(item => {
            return {
                id: getProperty(item, 'gmx_id'),
                content: setProperty(item, {'selected': selectedState})
            };
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

        const allData = store.getSerializedData('contours');
        const filteredAllData = allData.filter(item => getProperty(item, 'cart'));

        const { gmx_id: gmxId } = e.detail;
        let item = store.getData('contours', gmxId);

        let isCart = getProperty(item, 'cart');

        if (filteredAllData.length + 1 > MAX_CART_SIZE && !isCart) {
            events.trigger('sidebar:cart:limit');
            return;
        }

        const changedItem = setProperty(item, {'cart': !isCart, 'selected': true});

        store.updateData(
            'contours',
            {id: gmxId, content: changedItem},
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

        const {isChanged} = store.getData('clientFilter');
        const filteredResults = store[(isChanged ? 'getFilteredResults' : 'getResults')]();
        const notInCartResults = filteredResults.filter(item => !getProperty(item, 'cart'));
        const areSomeNotInCart = notInCartResults.length > 0;
        const favorites = store.getFavorites();

        if (areSomeNotInCart && (notInCartResults.length + favorites.length) > MAX_CART_SIZE) {
            events.trigger('sidebar:cart:limit');
            return;
        }

        const dataToRewrite = filteredResults.map(item => {
            const gmxId = getProperty(item, 'gmx_id');
            const changedItem = setProperty(item, {
                'cart': areSomeNotInCart,
                'selected': areSomeNotInCart
            });
           return { id: gmxId, content: changedItem };
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

        const data = store.getSerializedData('contours');
        const cartData = data.filter(item => getProperty(item, 'cart') && getProperty(item, 'selected'));

        if (cartData.length < 1) {
            return;
        }

        const dataToUpdate = cartData.map(item => {
            const gmxId = getProperty(item, 'gmx_id');
            const changedItem = setProperty(item, {
                'cart': false,
                'selected': false
            });
            return { id: gmxId, content: changedItem };
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

        const allResults = store.getResults();
        const cartResults = allResults.filter(item => getProperty(item, 'cart'));
        const visibleResults = allResults.filter(item => getProperty(item, 'visible') === 'visible' && !getProperty(item, 'cart'));

        if (visibleResults.length < 1) {
            return;
        }

        if ( (cartResults.length + visibleResults.length) > MAX_CART_SIZE ) {
            appEvents.trigger('sidebar:cart:limit');
            return;
        }

        const dataToUpdate = visibleResults.map(item => {
            const gmxId = getProperty(item, 'gmx_id');
            const changedItem = setProperty(item, {
                'cart': true,
                'selected': true
            });
            return { id: gmxId, content: changedItem };
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

        const snapShotsData = store.getData('contours');
        const keysToRemove = Object.keys(snapShotsData);

        if (keysToRemove.length < 1) {
            return;
        }

        // remove only results, not favourites
        const dataToRemove = keysToRemove.reduce(
            (data, gmxId) => {
                const item = snapShotsData[gmxId];
                if (getProperty(item, 'cart')) {
                    const changedItem = setProperty(item, {'result': false});
                    store.updateData('contours', {id: gmxId, content:changedItem});
                }
                else {
                    data.push([gmxId]);
                }
                return data;
            },
        []);

        let idsToRemove = [];
        dataToRemove.forEach(([id]) => {
            const numberId = parseInt(id);
            this.showQuicklookOnMap(numberId, false, true);
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
        const mergedData = mergeResults(oldData, contours);

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

    showQuicklookOnMap(id, isVisible, removeQuicklook = false) {

        return new Promise(redrawItemOnList => {

            const map = this.getMap();
            const application = this.getApplication();
            const serviceEvents = application.getServiceEvents();
            const store = application.getStore();
            let currentContour = store.getData('contours', id);
            let {quicklook} = currentContour;

            if (isVisible) {

                if (!quicklook) {
                    const sceneIdValue = getProperty(currentContour, 'sceneid');
                    const sceneid = splitComplexId(sceneIdValue).id;
                    const platform = getProperty(currentContour, 'platform');
                    const {url, width, height} = QUICKLOOK;
                    const imageUrl = `${url}?sceneid=${sceneid}&platform=${platform}&width=${width}&height=${height}`;
                    const {lng} = map.getCenter();
                    const clipCoordsValue = getProperty(currentContour, 'clip_coords');
                    const clipCoords = normalizeGeometry(clipCoordsValue, lng);
                    const [ x1,y1, x2,y2, x3,y3, x4,y4 ] = propertiesX1Slice(currentContour);
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
                        const gmxId = getProperty(currentContour, 'gmx_id');
                        const changedContour = setProperty(currentContour, {visible: 'visible'});
                        currentContour = { ...changedContour };
                        store.updateData(
                            'contours', {
                                id: gmxId,
                                content: currentContour
                            },['contours:bringToTop','contours:showQuicklookList']
                        );
                    });
                    quicklook.on('error', () => {
                        const gmxId = getProperty(currentContour, 'gmx_id');
                        const changedContour = setProperty(currentContour, {visible: 'failed'});
                        map.removeLayer(quicklook);
                        if (currentContour) {
                            currentContour = { ...changedContour, quicklook: null };
                            let events = [];
                            events.push('contours:bringToTop');
                            events.push('contours:showQuicklookList');
                            store.updateData('contours', {id: gmxId, content: currentContour}, events);
                        }
                    });

                    quicklook.addTo(map);
                    currentContour = { ...currentContour, quicklook };
                    store.updateData('contours', {id , content: currentContour});
                }
                else {
                    const changedContour = setProperty(currentContour, {'visible': 'visible'});
                    quicklook.addTo(map);

                    currentContour = { ...changedContour, quicklook };
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
        const visible = getProperty(currentContour, 'visible');

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
        const visibleState = favoritesData.some(item => getProperty(item, 'visible') === 'hidden');

        store.setMetaItem('updateResults', true);

        let gmxIdList = [];
        favoritesData.forEach(item => {
            const gmxId = getProperty(item, 'gmx_id');
            gmxIdList.push(gmxId);
        });

        gmxIdList.forEach(id => {
            const contour = store.getData('contours', id);
            const {properties = []} = contour;
            const visibleChangedState = getVisibleChangedState(visibleState, properties);
            if (visibleChangedState) {
                contour['properties'] = properties;
                store.updateData('contours', {id, content: contour}, ['contours:allQuicklooksList']);
                this.showQuicklookOnMap(id, visibleState)
                .then(() => events.trigger('contours:allQuicklooksList', id))
                .catch(e => console.log(e));
            }
        })
    }

    _showQuicklook (gmxId, show, fromMap = false) {
        return new Promise(() => {
            const application = this.getApplication();
            const events = application.getServiceEvents();
            const store = application.getStore();
            const contour = store.getData('contours', gmxId);
            const currentTab = store.getMetaItem('currentTab');

            if (contour) {

                const {properties = []} = contour;
                const visibleChangedState = getVisibleChangedState(show, properties); // TODO

                if (visibleChangedState) {
                    contour['properties'] = properties;
                    store.updateData('contours', {id: gmxId, content: contour}, ['contours:showQuicklookList']);

                    fromMap && events.trigger('contours:scrollToRow', gmxId, currentTab);

                    this.showQuicklookOnMap(gmxId, show)
                    .then(() => events.trigger('contours:showQuicklookList', gmxId))
                    .catch(e => window.console.error(e));
                }
            }
            else {
                console.warn('contour with id =', id, ' not found.');
            }
        });
    }

}