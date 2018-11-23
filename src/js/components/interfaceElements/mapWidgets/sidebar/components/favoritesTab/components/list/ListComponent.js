import BaseComponent from 'js/base/BaseComponent';

import { ACCESS_USER_ROLE, TAB_FAVORITES_NAME } from 'js/config/constants/constants';

import { getPanelHeight, propertiesToItem, getCorrectIndex } from 'js/utils/commonUtils';

import View from './view/View';


export default class FavoritesListComponent extends BaseComponent {

    init() {

        const application = this.getApplication();
        const store = application.getStore();

        const userInfo = store.getData('userInfo');
        const restricted = userInfo['Role'] === ACCESS_USER_ROLE;

        this._searchContainer = this.getParentComponent().getView();

        this._view = new View({
            restricted
        });

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const appEvents = application.getAppEvents();
        const store = application.getStore();
        const ContourController = application.getBridgeController('contour');
        const view = this.getView();

        appEvents.on('sidebar:tab:resize', (e) => this._resizeFavoritesList(e));
        appEvents.on('sidebar:tab:change', (e) => this._onTabChangeHandler(e));
        appEvents.on('contours:showQuicklookOnList', this._redrawItemOnList.bind(this));

        store.on('contours:addAllToCart', this._updateList.bind(this));
        store.on('contours:addToCart', this._updateList.bind(this));
        store.on('contours:setSelected', this._redrawItemOnList.bind(this));
        store.on('contours:showQuicklookOnList', this._redrawItemOnList.bind(this));
        store.on('contours:setHovered', this._highliteItemOnList.bind(this));
        store.on('contours:setAllSelected', this._updateList.bind(this));
        store.on('contours:removeSelectedFavorites', this._updateList.bind(this));
        store.on('contours:addVisibleToFavorites', this._updateList.bind(this));

        view.addEventListener('showInfo', this._onInfoHandler.bind(this));
        view.addEventListener('setSelected', (e) => ContourController.setSelectedOnListAndMap(e));
        view.addEventListener('setAllSelected', (e) => ContourController.setAllSelectedOnListAndMap(e));
        view.addEventListener('click', (e) => ContourController.zoomToContourOnMap(e));
        view.addEventListener('setVisible', (e) => ContourController.showQuicklookOnListAndMap(e));
        view.addEventListener('mouseover', (e, state = true) => ContourController.hoverContour(e, state));
        view.addEventListener('mouseout', (e, state = false) => ContourController.hoverContour(e, state));
    }

    _onTabChangeHandler(e) {

        const {detail: {current: currentTab}} = e;

        if (currentTab === TAB_FAVORITES_NAME) {

            this._resizeFavoritesList();
        }
    }

    _updateList() {

        const application = this.getApplication();
        const store = application.getStore();
        const favoritesData = store.getFavorites(true);

        this.getView().items = favoritesData;

        this._resizeFavoritesList();
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

    _resizeFavoritesList() {

        const view = this.getView();

        const total = getPanelHeight(
            document.body.querySelector('.scanex-sidebar'),
            [ '.favorites-header', '.favorites-footer' ]);

        view.resize(total);
        view.adjustWidth();
    }

    _onInfoHandler(e) {

        const view = this.getView();
        const bBox = view.bbox;

        this.events.trigger('imageDetails:show', e, bBox);
    }

}