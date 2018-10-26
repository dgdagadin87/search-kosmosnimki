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
            { restricted }
        );

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const appEvents = application.getAppEvents();
        const store = application.getStore();

        const view = this.getView();

        appEvents.on('sidebar:tab:resize', (e) => this._resizeResultsList(e));
        appEvents.on('sidebar:tab:change', (e) => this._onTabChangeHandler(e));

        store.on('snapshots:researched', this._updateList.bind(this));

        view.addEventListener('info', (e) => {
            const bBox = view.bbox;
            this.events.trigger('imageDetails:show', e, bBox);
        });
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

    _resizeResultsList() {

        const view = this.getView();

        const total = getPanelHeight(document.body.querySelector('.scanex-sidebar'), [ '.results-header' ]);

        view.resize(total);
        view.adjustWidth();
    }

}