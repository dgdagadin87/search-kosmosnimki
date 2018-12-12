import BaseComponent from 'js/base/BaseComponent';

import { ACCESS_USER_ROLE, TAB_FAVORITES_NAME } from 'js/config/constants/constants';

import { getPanelHeight } from 'js/utils/commonUtils';
import { getProperty, propertiesToItem } from 'js/application/searchDataStore/SearchDataStore';

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
        const events = application.getServiceEvents();
        const store = application.getStore();
        const view = this.getView();
        const ContourController = application.getBridgeController('contour');

        events.on('sidebar:tab:resize', (e) => this._resizeFavoritesList(e));
        events.on('contours:showQuicklookList', this._redrawItemOnList.bind(this));
        events.on('contours:allQuicklooksList', this._redrawItemOnList.bind(this));
        events.on('contours:scrollToRow', this._scrollToRow.bind(this));

        store.on('currentTab:changeUI', (e) => this._onTabChangeHandler(e));
        store.on('contours:addAllToCartList', this._updateList.bind(this));
        store.on('contours:setSelected', this._redrawItemOnList.bind(this));
        store.on('contours:showQuicklookList', this._redrawItemOnList.bind(this));
        store.on('contours:allQuicklooksList', this._redrawItemOnList.bind(this));
        store.on('contours:setHoveredList', this._highliteItemOnList.bind(this));
        store.on('contours:setAllSelectedList', this._updateList.bind(this));
        store.on('contours:removeSelectedFavoritesList', this._updateList.bind(this));
        store.on('contours:addVisibleToFavoritesList', this._updateList.bind(this));
        store.on('contours:addToCartList', this._updateList.bind(this));
        store.on('contours:startResearchedList', this._updateList.bind(this));

        view.addEventListener('showInfo', this._onInfoHandler.bind(this));
        view.addEventListener('setSelected', (e) => ContourController.setSelectedOnListAndMap(e));
        view.addEventListener('setAllSelected', (e) => ContourController.setAllSelectedOnListAndMap(e));
        view.addEventListener('click', (e) => ContourController.zoomToContourOnMap(e));
        view.addEventListener('setVisible', (e) => ContourController.showQuicklookOnListAndMap(e));
        view.addEventListener('setAllVisible', (e) => ContourController.showAllQuicklooksOnListAndMap(e));
        view.addEventListener('mouseover', (e, state = true) => ContourController.hoverContour(e, state));
        view.addEventListener('mouseout', (e, state = false) => ContourController.hoverContour(e, state));
    }

    _onTabChangeHandler() {

        const application = this.getApplication();
        const store = application.getStore();
        const currentTab = store.getMetaItem('currentTab');

        currentTab === TAB_FAVORITES_NAME && this._resizeFavoritesList();
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

        const item = store.getData('contours', itemId);
        const isHovered = getProperty(item, 'hover');

        if (isHovered) {
            view.hilite(itemId);
        }
        else {
            view.dim(itemId);
        }
    }

    _scrollToRow(gmxId, currentTab) {

        const view = this.getView();

        if (currentTab === TAB_FAVORITES_NAME) {

            view.scrollToRow(gmxId);
            this._highliteItemOnList(gmxId);
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