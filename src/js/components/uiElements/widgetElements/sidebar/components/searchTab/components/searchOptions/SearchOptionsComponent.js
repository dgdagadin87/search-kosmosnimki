import BaseComponent from 'js/base/BaseComponent';

import { ACCESS_USER_ROLE, TAB_SEARCH_NAME } from 'js/config/constants/constants';

import {getTotalHeight} from 'js/utils/commonUtils';

import View from './view/SearchOptions';


export default class SearchOptionsComponent extends BaseComponent {

    init() {

        const application = this.getApplication();
        const store = application.getStore();

        const userInfo = store.getData('userInfo');
        const restricted = userInfo['Role'] === ACCESS_USER_ROLE;

        this._searchContainer = this.getParentComponent().getView();

        this._view = new View(
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
        const store = application.getStore();
        const view = this.getView();

        events.on('sidebar:tab:resize', (e) => this._resizeSearchOptions(e));
        store.on('currentTab:changeUI', (e) => this._onTabChangeHandler(e));
        store.on('searchCriteria:fullUpdate', () => this._onCriteriaUpdate());
        view.addEventListener('change', (e) => this._onViewChangeSearchCriteria(e));
        view.addEventListener('changeDate', (e) => this._onViewChangeSearchDate(e));
    }

    _onCriteriaUpdate() {

        const application = this.getApplication();
        const store = application.getStore();

        const searchCriteria = store.getData('searchCriteria');

        this._view.criteria = searchCriteria;
    }

    _onTabChangeHandler() {

        const application = this.getApplication();
        const store = application.getStore();
        const view = this.getView();
        const currentTab = store.getMetaItem('currentTab');

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

        store.rewriteData('searchCriteria', changedSearchCriteria, ['searchCriteria:fullUpdate']);
    }

    _onViewChangeSearchDate(e) {

        const {detail: changedSearchCriteria} = e;

        const application = this.getApplication();
        const store = application.getStore();

        store.rewriteData('searchCriteria', changedSearchCriteria);
    }

}