import BaseLayerManager from 'js/base/BaseLayerManager';

import { getProperty } from 'js/application/searchDataStore/SearchDataStore';
import {
    LAYER_ATTRIBUTES,
    LAYER_ATTR_TYPES
} from 'js/application/searchDataStore/Attributes';

import {getBounds} from 'js/utils/commonUtils';


const Colors = {
    Default: 0x23a5cc,
    Hilite: 0x23a5cc,
    Cart: 0xef4e70,
    CartHilite: 0xef4e70,
};

export default class DrawingsLayerManager extends BaseLayerManager {

    constructor(props) {

        super(props);

        this._initVectorLayer();

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const events = application.getServiceEvents();
        const store = application.getStore();
        const layer = this._vectorLayer;
        const ContoursController = application.getBridgeController('contour');

        events.on('sidebar:tab:change:map', this._setCurrentTab.bind(this));
        events.on('sidebar:tab:change:map', this._toggleQuicklooks.bind(this));
        events.on('contours:zoomMap', this._zoomToContourOnMap.bind(this));
        events.on('contours:bringToTop', (id) => this._vectorLayer.bringToTopItem(id));
        events.on('contours:bringToBottom', (id) => this._vectorLayer.bringToBottomItem(id));

        layer.on('click', (e, fromMap = true) => ContoursController.showQuicklookOnListAndMap(e, fromMap));
        layer.on('mouseover', (e, state = true) => ContoursController.hoverContour(e, state));
        layer.on('mouseout', (e, state = false) => ContoursController.hoverContour(e, state));

        store.on('contours:researchedMap', this._addContoursOnMap.bind(this));
        store.on('contours:researchedMap', this._zoomToContoursOnMap.bind(this));
        store.on('contours:startResearchedMap', this._addContoursOnMap.bind(this));
        store.on('contours:startResearchedMap', this._zoomToContoursOnMap.bind(this));
        store.on('contours:addToCartMap', this._redrawContour.bind(this));
        store.on('contours:addAllToCartMap', this._redrawContours.bind(this));
        store.on('contours:setHoveredMap', this._redrawContour.bind(this));
        store.on('contours:setSelectedMap', this._redrawContour.bind(this));
        store.on('contours:setAllSelectedMap', this._redrawContours.bind(this));
        store.on('contours:removeSelectedFavoritesMap', this._redrawContours.bind(this));
        store.on('contours:addVisibleToFavoritesMap', this._redrawContours.bind(this));
        store.on('contours:bringToTop', (id) => this._vectorLayer.bringToTopItem(id));
        store.on('contours:bringToBottom', (id) => this._vectorLayer.bringToBottomItem(id));
        store.on('clientFilter:changeMap', this._redrawContours.bind(this));
        store.on('clientFilter:changeMap', this._toggleQuicklooks.bind(this));
    }

    _addContoursOnMap() {

        const application = this.getApplication();
        const store = application.getStore();

        const contours = store.getSerializedData('contours');
        const items = contours.map(({properties}) => properties);

        this._vectorLayer.removeData();
        this._vectorLayer.addData(items);
    }

    _zoomToContourOnMap(gmxId) {

        const application = this.getApplication();
        const store = application.getStore();

        const item = store.getData('contours', gmxId);
        const {properties} = item;

        const bounds  = getBounds([properties]);
        this._map.fitBounds(bounds, { animate: false });
    }

    _zoomToContoursOnMap() {

        const application = this.getApplication();
        const store = application.getStore();

        const contours = store[(this._currentTab === 'search' ? 'getResults' : 'getFavorites')]();
        const contoursProperties = contours.map(({properties}) => properties);

        if (contoursProperties.length < 1) {
            return;
        }

        let bounds = getBounds(contoursProperties);      
        if (bounds) {                        
            this._map.fitBounds(bounds, { animate: false });
        }
    }

    _redrawContour(gmxId) {

        this._vectorLayer.redrawItem(gmxId);
    }

    _redrawContours() {

        this._vectorLayer.repaint();
    }

    _setCurrentTab(e) {

        const {detail: {current}} = e;

        this._currentTab = current;
        this._redrawContours();
    }

    _toggleQuicklooks() {

        const application = this.getApplication();
        const store = application.getStore();
        const contours = store.getSerializedData('contours');
        const currentTab = this._currentTab;
        const contourController = application.getBridgeController('contour');
        const {
            filterData: {unChecked = [], clouds = [0, 100], angle = [0, 60], date = [0, 0]},
            isChanged = false
        } = store.getData('clientFilter');

        if (!currentTab) {
            return;
        }

        contours.forEach(item => {

            const resultValue = getProperty(item, 'result');
            const cartValue = getProperty(item, 'cart');
            const visibleValue = getProperty(item, 'visible');
            const indexValue = getProperty(item, 'gmx_id');

            let isVisible;

            if (currentTab === 'search') {
                isVisible = false;
            }

            if (currentTab === 'results') {
                const dateValue = getProperty(item, 'acqdate');
                const platformValue = getProperty(item, 'platform');
                const cloudnessValue = getProperty(item, 'cloudness');
                const angleValue = Math.abs(getProperty(item, 'tilt'));
                const acqDate = typeof dateValue === 'string' ? new Date(dateValue) : new Date(dateValue * 1000);

                const platformsCriteria = unChecked.indexOf(platformValue) === -1;
                const cloudsCriteria = isChanged ? clouds[0] <= cloudnessValue && cloudnessValue <= clouds[1] : true;
                const angleCriteria = isChanged ? angle[0] <= angleValue && angleValue <= angle[1] : true;
                const dateCriteria = isChanged ? date[0].getTime() <= acqDate.getTime() && acqDate.getTime() <= date[1].getTime() : true;

                isVisible = resultValue && visibleValue === 'visible' && (cartValue || (platformsCriteria && cloudsCriteria && angleCriteria && dateCriteria));
            }

            if (currentTab === 'favorites') {
                isVisible = cartValue && visibleValue === 'visible';
            }

            contourController.showQuicklookOnMap(indexValue, isVisible);
        });
    }

    _initVectorLayer() {

        const tab_filter = (item) => {

            const application = this.getApplication();
            const store = application.getStore();
            const {
                filterData: {unChecked = [], clouds = [0, 100], angle = [0, 60], date = [0, 0]},
                isChanged = false
            } = store.getData('clientFilter');
            
            const resultValue = getProperty(item, 'result');
            const cartValue = getProperty(item, 'cart');
            const dateValue = getProperty(item, 'acqdate');
            const platformValue = getProperty(item, 'platform');
            const cloudnessValue = getProperty(item, 'cloudness');
            const angleValue = Math.abs(getProperty(item, 'tilt'));
            const acqDate = typeof dateValue === 'string' ? new Date(dateValue) : new Date(dateValue * 1000);

            const platformsCriteria = unChecked.indexOf(platformValue) === -1;
            const cloudsCriteria = isChanged ? clouds[0] <= cloudnessValue && cloudnessValue <= clouds[1] : true;
            const angleCriteria = isChanged ? angle[0] <= angleValue && angleValue <= angle[1] : true;
            const dateCriteria = isChanged ? date[0].getTime() <= acqDate.getTime() && acqDate.getTime() <= date[1].getTime() : true;
        
            switch (this._currentTab) {
                case 'results':
                    return resultValue && (cartValue || (platformsCriteria && cloudsCriteria && angleCriteria && dateCriteria));
                case 'favorites':                                     
                    return cartValue;
                case 'search':
                    return false;
                default:
                    return true;
            }
        };

        this._vectorLayer = L.gmx.createLayer({
            geometry: null,
            properties: {
                type: 'Vector',
                visible: true,
                identityField: 'gmx_id',
                GeometryType: 'polygon',                
                srs: 3857,
                attributes: LAYER_ATTRIBUTES,
                attrTypes: LAYER_ATTR_TYPES,
                styles: [
                    {
                        MinZoom: 3,
                        MaxZoom: 17,
                        DisableBalloonOnClick: true,
                        DisableBalloonOnMouseMove: true,                        
                        RenderStyle:{
                            outline: { color: Colors.Default, thickness: 1 },
                            fill: { color: 0xfff, opacity: 0 }
                        },                       
                        HoverStyle:{
                            outline: { color: Colors.Default, thickness: 1 },
                            fill: { color: 0xfff, opacity: 0 }
                        },
                    }
                ]
            },
        });
        this._vectorLayer.disableFlip();
        this._vectorLayer.setFilter (tab_filter);
        this._vectorLayer.setStyleHook (item => {
            const currentTab = this._currentTab;
            const hoverValue = getProperty(item, 'hover');
            const cartValue = getProperty(item, 'cart');
            let lineWidth = 1;
            let color = Colors.Default;

            if (currentTab === 'results' && cartValue) {
                lineWidth = 3;
            }
            if (hoverValue) {
                color = cartValue ? Colors.CartHilite : Colors.Hilite;
                lineWidth = 5;
            }
            else {
                color = cartValue ? Colors.Cart : Colors.Default;
            }
            return { skipRasters: true, strokeStyle: color, lineWidth };

        });
        this._vectorLayer.addTo(this._map);
    }

}