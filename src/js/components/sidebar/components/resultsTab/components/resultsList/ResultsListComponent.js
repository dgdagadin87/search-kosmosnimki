import BaseComponent from '../../../../../../base/BaseComponent';

import {
    ACCESS_USER_ROLE,
    TAB_RESULTS_NAME
} from '../../../../../../config/constants/constants';

import { getPanelHeight, propertiesToItem } from '../../../../../../utils/commonUtils';

import ResultList from './view/ResultList';


export default class ResultListComponent extends BaseComponent {

    init() {

        const application = this.getApplication();
        const store = application.getStore();

        const userInfo = store.getData('userInfo');
        const restricted = userInfo['Role'] === ACCESS_USER_ROLE;

        this._searchContainer = this.getParentComponent().getView()._container;

        this._view = new ResultList(
            this._searchContainer.querySelector('.results-pane'),
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

        appEvents.on('sidebar:tab:resize', (e) => this._resizeResultsList(e));
        appEvents.on('sidebar:tab:change', (e) => this._onTabChangeHandler(e));

        store.on('snapshots:researched', this._updateList.bind(this));
        store.on('snapshots:addAllToCart', this._updateList.bind(this));
        store.on('snapshots:addToCart', this._redrawItemOnList.bind(this));

        view.addEventListener('showInfo', this._onInfoHandler.bind(this));
        view.addEventListener('click', (e) => SnapshotBridgeController.zoomToContourOnMap(e));
        view.addEventListener('setVisible', (e) => SnapshotBridgeController.showQuicklookOmListAndMap(e));
        view.addEventListener('mouseover', (e, state = true) => SnapshotBridgeController.hoverContourOnMap(e, state));
        view.addEventListener('mouseout', (e, state = false) => SnapshotBridgeController.hoverContourOnMap(e, state));
        view.addEventListener('addToCart', (e) => SnapshotBridgeController.addToCartOnListAndMap(e));
        view.addEventListener('addAllToCart', (e) => SnapshotBridgeController.addAllToCartOnListAndMap(e));
    }

    _onTabChangeHandler(e) {

        const {detail: {current: currentTab}} = e;

        if (currentTab === TAB_RESULTS_NAME) {

            this.getView().refresh();
            this._resizeResultsList();
        }
    }

    _updateList() {

        const application = this.getApplication();
        const store = application.getStore();

        const snapshotItems = store.getData('snapshots');
        const commonData = Object.keys(snapshotItems).map((id) => {
            
            const item = snapshotItems[id];
            const {properties} = item;

            return propertiesToItem(properties);
        });
        const filteredData = commonData.filter(item => item.result);

        this.getView().items = filteredData;

        this._resizeResultsList();
    }

    _redrawItemOnList(itemId) {

        const application = this.getApplication();
        const store = application.getStore();
        const view = this.getView();

        const item = store.getData('snapshots', itemId);
        const preparedItem = propertiesToItem(item['properties']);

        view.redrawItem(itemId, preparedItem);
    }

    _resizeResultsList() {

        const view = this.getView();

        const total = getPanelHeight(document.body.querySelector('.scanex-sidebar'), [ '.results-header' ]);

        view.resize(total);
        view.adjustWidth();
    }

    _onInfoHandler(e) {

        const view = this.getView();
        const bBox = view.bbox;

        this.events.trigger('imageDetails:show', e, bBox);
    }

}