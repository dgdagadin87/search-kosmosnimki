import BaseComponent from 'js/base/BaseComponent';

import { ACCESS_USER_ROLE, TAB_RESULTS_NAME} from 'js/config/constants/constants';

import { propertiesToItem, getCorrectIndex } from 'js/utils/commonUtils';

import View from './view/View';


export default class ResultListComponent extends BaseComponent {

    init() {

        const application = this.getApplication();
        const store = application.getStore();

        const userInfo = store.getData('userInfo');
        const restricted = userInfo['Role'] === ACCESS_USER_ROLE;

        this._view = new View({
            restricted
        });

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const events = application.getServiceEvents();
        const store = application.getStore();
        const ContourController = application.getBridgeController('contour');
        const view = this.getView();

        events.on('sidebar:tab:resize', (e) => this._resizeList(e));
        events.on('sidebar:tab:change', (e) => this._onTabChangeHandler(e));
        events.on('contours:showQuicklookList', this._redrawItemOnList.bind(this));
        events.on('contours:scrollToRow', this._scrollToRow.bind(this));

        store.on('contours:researchedList', this._updateList.bind(this));
        store.on('contours:startResearchedList', this._updateList.bind(this));
        store.on('contours:addAllToCartList', this._updateList.bind(this));
        store.on('contours:removeSelectedFavoritesList', this._updateList.bind(this));
        store.on('contours:addVisibleToFavoritesList', this._updateList.bind(this));
        store.on('contours:addToCartList', this._redrawItemOnList.bind(this));
        store.on('contours:showQuicklookList', this._redrawItemOnList.bind(this));
        store.on('contours:setHoveredList', this._highliteItemOnList.bind(this));

        view.addEventListener('showInfo', this._onInfoHandler.bind(this));
        view.addEventListener('click', (e) => ContourController.zoomToContourOnMap(e));
        view.addEventListener('setVisible', (e) => ContourController.showQuicklookOnListAndMap(e));
        view.addEventListener('mouseover', (e, state = true) => ContourController.hoverContour(e, state));
        view.addEventListener('mouseout', (e, state = false) => ContourController.hoverContour(e, state));
        view.addEventListener('addToCart', (e) => ContourController.addToCartOnListAndMap(e));
        view.addEventListener('addAllToCart', (e) => ContourController.addAllToCartOnListAndMap(e));
    }

    _onTabChangeHandler(e) {

        const application = this.getApplication();
        const store = application.getStore();
        const {detail: {current: currentTab}} = e;

        if (currentTab === TAB_RESULTS_NAME) {
            const willUpdateResults = store.getData('updateResults');
            const methodName = '_' + (willUpdateResults ? 'update' : 'resize') + 'List';
            this[methodName]();
            store.rewriteData('updateResults', false);
        }
    }

    _updateList() {

        const application = this.getApplication();
        const store = application.getStore();
        const resultsData = store.getResults(true);
        const view = this.getView();

        view.items = resultsData;

        this._resizeList();
    }

    _redrawItemOnList(itemId) {

        const application = this.getApplication();
        const store = application.getStore();
        const view = this.getView();

        const item = store.getData('contours', itemId);
        const preparedItem = propertiesToItem(item['properties']);

        view.redrawItem(itemId, preparedItem);
    }

    _highliteItemOnList(itemId) {

        const application = this.getApplication();
        const store = application.getStore();
        const view = this.getView();

        const hoverIndex = getCorrectIndex('hover');

        const item = store.getData('contours', itemId);
        
        const {properties = []} = item;
        const isHovered = properties[hoverIndex];

        if (isHovered) {
            view.hilite(itemId);
        }
        else {
            view.dim(itemId);
        }
    }

    _scrollToRow(gmxId, currentTab) {

        const view = this.getView();

        if (currentTab === TAB_RESULTS_NAME) {

            view.scrollToRow(gmxId);
            this._highliteItemOnList(gmxId);
        }
    }

    _resizeList() {

        const view = this.getView();

        view.resizeList();
    }

    _onInfoHandler(e) {

        const view = this.getView();
        const bBox = view.bbox;

        this.events.trigger('imageDetails:show', e, bBox);
    }

}