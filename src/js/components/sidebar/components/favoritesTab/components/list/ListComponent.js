import BaseComponent from '../../../../../../base/BaseComponent';

import { ACCESS_USER_ROLE, TAB_FAVORITES_NAME } from '../../../../../../config/constants/constants';

import { getPanelHeight, propertiesToItem, getCorrectIndex } from '../../../../../../utils/commonUtils';

import FavoriteList from './view/View';


export default class ResultListComponent extends BaseComponent {

    init() {

        const application = this.getApplication();
        const store = application.getStore();

        const userInfo = store.getData('userInfo');
        const restricted = userInfo['Role'] === ACCESS_USER_ROLE;

        this._searchContainer = this.getParentComponent().getView();

        this._view = new FavoriteList(
            this._searchContainer.querySelector('.favorites-pane'),
            { restricted, application }
        );

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const appEvents = application.getAppEvents();
        const store = application.getStore();
        const SnapshotBridgeController = application.getBridgeController('snapshot');
        const view = this.getView();

        appEvents.on('sidebar:tab:resize', (e) => this._resizeFavoritesList(e));
        appEvents.on('sidebar:tab:change', (e) => this._onTabChangeHandler(e));

        store.on('snapshots:addAllToCart', this._updateList.bind(this));
        store.on('snapshots:addToCart', this._updateList.bind(this));
        store.on('snapshots:setSelected', this._redrawItemOnList.bind(this));
        store.on('snapshots:setAllSelected', this._updateList.bind(this));
        store.on('snapshots:removeSelectedFavorites', this._updateList.bind(this));

        view.addEventListener('showInfo', this._onInfoHandler.bind(this));
        view.addEventListener('setSelected', (e) => SnapshotBridgeController.setSelectedOnListAndMap(e));
        view.addEventListener('setAllSelected', (e) => SnapshotBridgeController.setAllSelectedOnListAndMap(e));
        view.addEventListener('click', (e) => SnapshotBridgeController.zoomToContourOnMap(e));
        view.addEventListener('setVisible', (e) => SnapshotBridgeController.showQuicklookOnListAndMap(e));
        view.addEventListener('mouseover', (e, state = true) => SnapshotBridgeController.hoverContour(e, state));
        view.addEventListener('mouseout', (e, state = false) => SnapshotBridgeController.hoverContour(e, state));
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

        const item = store.getData('snapshots', itemId);
        const preparedItem = propertiesToItem(item['properties']);

        view.redrawItem(itemId, preparedItem);
    }

    _highliteItemOnList(itemId) {

        const application = this.getApplication();
        const store = application.getStore();
        const view = this.getView();

        const hoverIndex = getCorrectIndex('hover');

        const item = store.getData('snapshots', itemId);
        
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