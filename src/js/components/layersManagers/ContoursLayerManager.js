import BaseLayerManager from 'js/base/BaseLayerManager';

import {LAYER_ATTRIBUTES, LAYER_ATTR_TYPES} from 'js/config/constants/constants';

import {getCorrectIndex, getBounds} from 'js/utils/commonUtils';


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
        const propertyIndex = getCorrectIndex((this._currentTab === 'result' ? 'result' : 'favorites'));

        const contours = store.getSerializedData('contours');
        const seriaLizedSnapShots = contours.map(({properties}) => properties);
        const resultItems = seriaLizedSnapShots.filter(properties => properties[propertyIndex]);

        if (resultItems.length < 1) {
            return;
        }

        let bounds = getBounds(resultItems);      
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

        const resultIndex = getCorrectIndex('result');
        const cartIndex = getCorrectIndex('cart');
        const visibleIndex = getCorrectIndex('visible');
        const gmxIdIndex = getCorrectIndex('gmx_id');
        const cloudnessIndex = getCorrectIndex('cloudness');
        const platformIndex = getCorrectIndex('platform');
        const angleIndex = getCorrectIndex('tilt');
        const dateIndex = getCorrectIndex('acqdate');

        if (!currentTab) {
            return;
        }

        contours.forEach(item => {

            const {properties = []} = item;
            const visibleValue = properties[visibleIndex];
            const indexValue = properties[gmxIdIndex];
            const acqDate = typeof properties[dateIndex] === 'string' ? new Date(properties[dateIndex]) : new Date(properties[dateIndex] * 1000);

            const platformsCriteria = unChecked.indexOf(properties[platformIndex]) === -1;
            const cloudsCriteria = isChanged ? clouds[0] <= properties[cloudnessIndex] && properties[cloudnessIndex] <= clouds[1] : true;
            const angleCriteria = isChanged ? angle[0] <= properties[angleIndex] && properties[angleIndex] <= angle[1] : true;
            const dateCriteria = isChanged ? date[0].getTime() <= acqDate.getTime() && acqDate.getTime() <= date[1].getTime() : true;

            let isVisible;

            if (currentTab === 'search') {
                isVisible = false;
            }

            if (currentTab === 'results') {
                isVisible = properties[resultIndex] && visibleValue === 'visible' && (properties[cartIndex] || (platformsCriteria && cloudsCriteria && angleCriteria && dateCriteria));
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
        const resultIndex = getCorrectIndex('result');
        const platformIndex = getCorrectIndex('platform');
        const cloudnessIndex = getCorrectIndex('cloudness');
        const angleIndex = getCorrectIndex('tilt');
        const dateIndex = getCorrectIndex('acqdate');

        const tab_filter = ({properties}) => {

            const application = this.getApplication();
            const store = application.getStore();
            const {
                filterData: {unChecked = [], clouds = [0, 100], angle = [0, 60], date = [0, 0]},
                isChanged = false
            } = store.getData('clientFilter');
            const acqDate = typeof properties[dateIndex] === 'string' ? new Date(properties[dateIndex]) : new Date(properties[dateIndex] * 1000);
            const angleValue = Math.abs(properties[angleIndex]);

            const platformsCriteria = unChecked.indexOf(properties[platformIndex]) === -1;
            const cloudsCriteria = isChanged ? clouds[0] <= properties[cloudnessIndex] && properties[cloudnessIndex] <= clouds[1] : true;
            const angleCriteria = isChanged ? angle[0] <= angleValue && angleValue <= angle[1] : true;
            const dateCriteria = isChanged ? date[0].getTime() <= acqDate.getTime() && acqDate.getTime() <= date[1].getTime() : true;
        
            switch (this._currentTab) {
                case 'results':
                    return properties[resultIndex] && (properties[cartIndex] || (platformsCriteria && cloudsCriteria && angleCriteria && dateCriteria));
                case 'favorites':                                     
                    return properties[cartIndex];
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
            let currentTab = this._currentTab;
            let {properties} = item;
            let color = Colors.Default;
            let lineWidth = 1;

            if (currentTab === 'results' && properties[cartIndex]) {
                lineWidth = 3;
            }
            if (properties[hoverIndex]) {
                color = properties[cartIndex] ? Colors.CartHilite : Colors.Hilite;
                lineWidth = 5;
            }
            else {
                color = properties[cartIndex] ? Colors.Cart : Colors.Default;
            }
            return { skipRasters: true, strokeStyle: color, lineWidth };

        });
        this._vectorLayer.addTo(this._map);
    }

}