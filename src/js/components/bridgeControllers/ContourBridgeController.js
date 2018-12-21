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
    isVisibleChanged,
    getChangedVisibleState
} from 'js/application/searchDataStore/SearchDataStore';

import {MAX_CART_SIZE, QUICKLOOK} from 'js/config/constants/constants';
import { CONTOUR_ITEM_ATTRIBUTES } from 'js/application/searchDataStore/Attributes';


export default class ContourBridgeController extends BaseBridgeController {

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
            this.toggleQuicklook(numberId, false, true);
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

            let value = CONTOUR_ITEM_ATTRIBUTES.reduce((contourData, attrKey) => {

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
        const events = application.getServiceEvents();
        const currentTab = store.getMetaItem('currentTab');

        let currentContour = store.getData('contours', gmxId);
        let visible = getProperty(currentContour, 'visible');
        let showState = ['visible','loading'].indexOf(visible) !== -1 ? false : true;
        let isChanged = isVisibleChanged(currentContour, showState);

        if (!currentContour || visible === 'loading' || !isChanged) {
            !currentContour && window.console.warn('contour with id =', id, ' not found.');
            return;
        }

        visible = getChangedVisibleState(currentContour, showState);
        currentContour = setProperty(currentContour, {visible});

        store.updateData('contours', {
            id: gmxId,
            content: currentContour
        }, ['contours:showQuicklookList']);

        fromMap && events.trigger('contours:scrollToRow', gmxId, currentTab);

        this.toggleQuicklook(gmxId, showState)
        .then(() => events.trigger('contours:showQuicklookList', gmxId))
        .catch((e) => this._errorHandler(e));
    }

    showAllQuicklooksOnListAndMap() {

        const application = this.getApplication();
        const store = application.getStore();
        const events = application.getServiceEvents();
        const favoritesData = store.getFavorites();
        const visibleState = favoritesData.some(item => getProperty(item, 'visible') === 'hidden');

        store.setMetaItem('updateResults', true);

        let gmxIdList = [];
        favoritesData.forEach(item => gmxIdList.push(getProperty(item, 'gmx_id')));

        gmxIdList.forEach(gmxId => {
            let contour = store.getData('contours', gmxId);
            if (!isVisibleChanged(contour, visibleState)) {
                return;
            }
            const visible = getChangedVisibleState(contour, visibleState);
            contour = setProperty(contour, {visible});
            store.updateData('contours', {id: gmxId, content: contour}, ['contours:allQuicklooksList']);
            this.toggleQuicklook(gmxId, visibleState)
            .then(() => events.trigger('contours:allQuicklooksList', gmxId))
            .catch((e) => this._errorHandler(e));
        })
    }

    toggleQuicklook(id, isVisible, removeQuicklook = false) {

        return new Promise(redrawItemResolve => {

            const map = this.getMap();
            const application = this.getApplication();
            const serviceEvents = application.getServiceEvents();
            const store = application.getStore();
            let currentContour = store.getData('contours', id);
            let {quicklook} = currentContour;

            if (isVisible) {

                if (!quicklook) {
                    let quicklook = this._createQuicklook(currentContour);

                    quicklook.addTo(map);

                    currentContour = { ...currentContour, quicklook };
                    store.updateData('contours', {id , content: currentContour});
                }
                else {
                    const changedContour = setProperty(currentContour, {'visible': 'visible'});
                    currentContour = { ...changedContour, quicklook };
                    store.updateData('contours', {id, content: currentContour}, ['contours:bringToTop']);

                    quicklook.addTo(map);

                    redrawItemResolve();
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
                redrawItemResolve();
            }
        });
    }

    _createQuicklook(contourData) {

        let contour = contourData;

        const application = this.getApplication();
        const map = application.getMap();
        const store = application.getStore();

        const gmxId = getProperty(contour, 'gmx_id');
        const sceneIdValue = getProperty(contour, 'sceneid');
        const sceneid = splitComplexId(sceneIdValue).id;
        const platform = getProperty(contour, 'platform');
        const {url, width, height} = QUICKLOOK;
        const imageUrl = `${url}?sceneid=${sceneid}&platform=${platform}&width=${width}&height=${height}`;
        const {lng} = map.getCenter();
        const clipCoordsValue = getProperty(contour, 'clip_coords');
        const clipCoords = normalizeGeometry(clipCoordsValue, lng);
        const [ x1,y1, x2,y2, x3,y3, x4,y4 ] = propertiesX1Slice(contour);
        const anchors = [
            [makeCloseTo(lng, x1),y1],
            [makeCloseTo(lng, x2),y2],
            [makeCloseTo(lng, x3),y3],
            [makeCloseTo(lng, x4),y4]
        ];

        let quicklook = L.imageTransform(imageUrl, flatten(anchors, true), { 
            clip: clipCoords,
            disableSetClip: true,
            pane: 'tilePane'
        });

        quicklook.on('load', () => {
            contour = setProperty(contour, {visible: 'visible'});
            store.updateData(
                'contours', {
                    id: gmxId,
                    content: { ...contour, quicklook }
                },['contours:bringToTop','contours:showQuicklookList']
            );
        });

        quicklook.on('error', () => {
            contour = setProperty(contour, {visible: 'failed'});
            map.removeLayer(quicklook);
            if (contour) {
                contour = { ...contour, quicklook: null };
                store.updateData('contours', {
                    id: gmxId, content: contour
                }, ['contours:showQuicklookList']);
            }
        });

        return quicklook;
    }

    _errorHandler(e) {

        window.console.error(e);
    }

}