import Translations from 'scanex-translations';

import BaseCompositedComponent from 'js/base/BaseCompositedComponent';

import SearchWidgetComponent from './components/searchWidget/SearchWidgetComponent';

import { ACCESS_USER_ROLE, TAB_SEARCH_NAME } from 'js/config/constants/Constants';

import View from './view/View.html';


export default class SearchTabComponent extends BaseCompositedComponent {

    init() {

        this._addTabToSidebar();

        this._view = new View({
            target: document.querySelector('[data-pane-id="search"]')
        });

        this.initChildren([
            {
                index: 'searchWidget',
                constructor: SearchWidgetComponent
            }
        ]);

        this._setViewData();

        this._bindEvents();

        //this._application._modalComponent.show({component: 'message'});
    }

    _bindEvents() {

        const application = this.getApplication();
        const events = application.getServiceEvents();
        const store = application.getStore();
        const view = this.getView();

        events.on('sidebar:tab:resize', this._resizeSearchOptions.bind(this));
        store.on('currentTab:changeUI', this._onTabChangeHandler.bind(this));
        store.on('searchCriteria:update', this._setViewData.bind(this));
        view.on('change', this.onCriteriaDataChange.bind(this));
        view.on('search', this._onSearchButtonClick.bind(this));
    }

    _setViewData() {

        const application = this.getApplication();
        const store = application.getStore();
        const view = this.getView();

        const defaultCriteria = store.getData('searchCriteria');
        const userInfo = store.getData('userInfo');
        const restricted = userInfo['IsAuthenticated'] && userInfo['Role'] === ACCESS_USER_ROLE;

        view.set({ ...defaultCriteria, restricted });
    }

    onCriteriaDataChange(criteriaData) {

        const application = this.getApplication();
        const store = application.getStore();

        store.rewriteData('searchCriteria', criteriaData);
    }

    _onTabChangeHandler() {

        const application = this.getApplication();
        const store = application.getStore();
        const currentTab = store.getMetaItem('currentTab');

        if (currentTab === TAB_SEARCH_NAME) {
            this._setViewData();
            this._resizeSearchOptions();
        }
    }

    _resizeSearchOptions() {

        const view = this.getView();

        view.resize();
    }

    _onSearchButtonClick() {

        this.events.trigger('searchButton:click');
    }

    _addTabToSidebar() {

        this._view = this.getParentComponent().getView().addTab({
            id: 'search',
            icon: 'sidebar-search',
            opened: 'sidebar-search-opened',
            closed: 'sidebar-search-closed',
            tooltip: Translations.getText('search.title'), 
        });
    }

    _isSomeSatellitesChecked() {

        const application = this.getApplication();
        const store = application.getStore();

        const searchCriteria = store.getData('searchCriteria');
        const {satellites: {pc = [], ms = []}} = searchCriteria;

        return ms.some(x => x.checked) || pc.some(x => x.checked);
    }

}