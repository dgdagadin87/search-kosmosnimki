import BaseLayerManager from 'js/base/BaseLayerManager';

import {LAYER_ATTRIBUTES, LAYER_ATTR_TYPES} from 'js/config/constants/constants';

import {getCorrectIndex, makeCloseTo, getBbox} from 'js/utils/commonUtils';


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

        window.console.log('Contours layer manager was initialized');
    }

    _bindEvents() {

        const application = this.getApplication();
        const appEvents = application.getAppEvents();
        const store = application.getStore();
        const vectorLayer = this._vectorLayer;
        const ContoursController = application.getBridgeController('contour');

        appEvents.on('sidebar:tab:change', this._setCurrentTab.bind(this));
        appEvents.on('sidebar:tab:change', this._toggleQuicklooks.bind(this));
        appEvents.on('contours:zoomMap', this._zoomToContourOnMap.bind(this));
        appEvents.on('contours:bringToTop', (id) => {
            this._vectorLayer.bringToTopItem(id)
        });
        appEvents.on('contours:bringToBottom', (id) => {
            this._vectorLayer.bringToBottomItem(id)
        });

        vectorLayer.on('mouseover', (e, state = true) => ContoursController.hoverContour(e, state));
        vectorLayer.on('mouseout', (e, state = false) => ContoursController.hoverContour(e, state));

        store.on('contours:researchedMap', this._addContoursOnMap.bind(this));
        store.on('contours:researchedMap', this._zoomToContoursOnMap.bind(this));
        store.on('contours:addToCartMap', this._redrawContour.bind(this));
        store.on('contours:addAllToCartMap', this._redrawContours.bind(this));
        store.on('contours:setHoveredMap', this._redrawContour.bind(this));
        store.on('contours:setSelectedMap', this._redrawContour.bind(this));
        store.on('contours:setAllSelectedMap', this._redrawContours.bind(this));
        store.on('contours:removeSelectedFavoritesMap', this._redrawContours.bind(this));
        store.on('contours:bringToTop', (id) => this._vectorLayer.bringToTopItem(id));
        store.on('contours:bringToBottom', (id) => this._vectorLayer.bringToBottomItem(id));
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

        const bounds  = this.getBounds([properties]);
        this._map.fitBounds(bounds, { animate: false });
    }

    _zoomToContoursOnMap() {

        const application = this.getApplication();
        const store = application.getStore();

        const propertyIndex = getCorrectIndex('result');

        const contours = store.getSerializedData('contours');

        const seriaLizedSnapShots = contours.map(({properties}) => properties);
        const resultItems = seriaLizedSnapShots.filter(properties => properties[propertyIndex]);

        if (resultItems.length < 1) {
            return;
        }

        let bounds = this.getBounds(resultItems);      
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

        const resultIndex = getCorrectIndex('result');
        const cartIndex = getCorrectIndex('cart');
        const visibleIndex = getCorrectIndex('visible');
        const gmxIdIndex = getCorrectIndex('gmx_id');

        if (!currentTab) {
            return;
        }

        contours.forEach(item => {

            const {properties = []} = item;
            const visibleValue = properties[visibleIndex];
            const indexValue = properties[gmxIdIndex];

            let isVisible;

            if (currentTab === 'search') {
                isVisible = false;
            }

            if (currentTab === 'results') {
                isVisible = properties[resultIndex] && visibleValue === 'visible';
            }

            if (currentTab === 'favorites') {
                isVisible = properties[cartIndex] && visibleValue === 'visible';
            }

            contourController.showQuicklookOnMap(indexValue, isVisible);
        });
    }

    _initVectorLayer() {

        const hoverIndex = getCorrectIndex('hover');
        const cartIndex = getCorrectIndex('cart');

        const tab_filter = ({properties}) => {

            const filtered = true;
        
            const resultIndex = getCorrectIndex('result');
            const cartIndex = getCorrectIndex('cart');
        
            switch (this._currentTab) {
                case 'results':
                    return filtered && properties[resultIndex];
                case 'favorites':                                     
                    return filtered && properties[cartIndex];
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
            let {properties} = item;
            let color = Colors.Default;
            let lineWidth = 1;
            if (properties[hoverIndex]) {
                color = properties[cartIndex] ? Colors.CartHilite : Colors.Hilite;
                lineWidth = 3;
            }
            else {
                color = properties[cartIndex] ? Colors.Cart : Colors.Default;
            }
            return { skipRasters: true, strokeStyle: color, lineWidth };
        });
        this._vectorLayer.addTo(this._map);
    }

    _normBounds (x2,x4) {
        if (x2 < 0 && x4 > 0) {
            return [x2 + 360, x4];
        }
        else if (x2 > 0 && x4 < 0) {
            return [x2, x4 + 360];
        }
    }

    getBounds (items) {        
        let bounds = items.reduce((a,properties) => {
            const geometry = L.gmxUtil.convertGeometry(properties[properties.length - 1], true, true);
            let [[x1,y1],[x2,y2],[x3,y3],[x4,y4]] = getBbox(geometry);            
            let ne = L.latLng(y2,x2);
            let sw = L.latLng(y4,x4);
            let b = L.latLngBounds(ne, sw);
            if (a === null) {            
                a = b;
            }
            else {
                a.extend(b);
            }
            return a;
        }, null);
        let ne = bounds.getNorthEast();
        let sw = bounds.getSouthWest();
        const lng = ne.lng;
        ne = L.latLng (ne.lat, makeCloseTo(lng, ne.lng));
        sw = L.latLng (sw.lat, makeCloseTo(lng, sw.lng));
        return L.latLngBounds(ne, sw);
    }

}