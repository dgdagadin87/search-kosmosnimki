import BaseComponent from 'js/base/BaseComponent';

import { ACCESS_USER_ROLE, TAB_SEARCH_NAME } from 'js/config/constants/constants';

import {getTotalHeight} from 'js/utils/commonUtils';

import SearchOptions from './view/SearchOptions';


export default class SearchOptionsComponent extends BaseComponent {

    init() {

        const application = this.getApplication();
        const store = application.getStore();

        const userInfo = store.getData('userInfo');
        const restricted = userInfo['Role'] === ACCESS_USER_ROLE;

        this._searchContainer = this.getParentComponent().getView();

        this._view = new SearchOptions(
            this._searchContainer.querySelector('.search-options-pane'),
            { restricted }
        );

        const defaultCriteria = store.getData('searchCriteria');

        this._view.criteria = defaultCriteria;

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const events = application.getServiceEvents();
        const view = this.getView();

        events.on('sidebar:tab:resize', (e) => this._resizeSearchOptions(e));
        events.on('sidebar:tab:change', (e) => this._onTabChangeHandler(e));

        view.addEventListener('change', (e) => this._onViewChangeSearchCriteria(e));
    }

    _onTabChangeHandler(e) {

        const {detail: {current: currentTab}} = e;
        const view = this.getView();

        if (currentTab === TAB_SEARCH_NAME) {

            view.refresh();
            this._resizeSearchOptions();
        }
    }

    _resizeSearchOptions() {
    
        const { height } = document.body.querySelector('.scanex-sidebar').getBoundingClientRect();
        const total = height - getTotalHeight(['.search-pane', '.search-options-footer' ]) - 11;

        this.getView().resize(total);
    }

    _onViewChangeSearchCriteria(e) {

        const {detail: changedSearchCriteria} = e;

        const application = this.getApplication();
        const store = application.getStore();

        store.rewriteData('searchCriteria', changedSearchCriteria, ['store:searchCriteria:full:update']);
    }

}