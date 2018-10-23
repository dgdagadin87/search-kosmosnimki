import BaseComponent from '../../../../../../base/BaseComponent';

import {
    ACCESS_USER_ROLE,
    TAB_SEARCH_NAME
} from '../../../../../../config/constants/constants';

import {getTotalHeight} from '../../../../../../utils/commonUtils';

import SearchOptions from './view/SearchOptions';


export default class SearchOptionsComponent extends BaseComponent {

    init() {

        const application = this.getApplication();
        const store = application.getStore();

        const userInfo = store.getConstantableData('userInfo');
        const restricted = userInfo['Role'] === ACCESS_USER_ROLE;

        this._searchContainer = this.getParentComponent().getView()._container;

        this._view = new SearchOptions(
            this._searchContainer.querySelector('.search-options-pane'),
            { restricted }
        );

        const defaultCriteria = store.getData('searchCriteria');

        this.getView().criteria = defaultCriteria;

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const appEvents = application.getAppEvents();

        const view = this.getView();

        window.addEventListener('resize', () => this._resizeSearchOptions());

        appEvents.on('sidebar:tab:change', (e) => this._onTabChangeHandler(e));

        view.addEventListener('change', (e) => console.log(e));
    }

    _onTabChangeHandler(e) {

        const {detail: {current: currentTab}} = e;

        if (currentTab === TAB_SEARCH_NAME) {

            this.getView().refresh();
            this._resizeSearchOptions();
            // ...hide contours
        }
    }

    _resizeSearchOptions() {
    
        const { height } = document.body.querySelector('.scanex-sidebar').getBoundingClientRect();
        const total = height - getTotalHeight(['.search-pane', '.search-options-footer' ]) - 11;

        this.getView().resize(total);
    }

}