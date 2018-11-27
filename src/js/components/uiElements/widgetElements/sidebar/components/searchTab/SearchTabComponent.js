import Translations from 'scanex-translations';

import BaseCompositedComponent from 'js/base/BaseCompositedComponent';

import SearchWidgetComponent from './components/searchWidget/SearchWidgetComponent';
import SearchOptionsComponent from './components/searchOptions/SearchOptionsComponent';


export default class SearchTabComponent extends BaseCompositedComponent {

    init() {

        this._addTabToSidebar();

        this.initChildren([
            {
                index: 'searchWidget',
                constructor: SearchWidgetComponent
            },
            {
                index: 'searchOptions',
                constructor: SearchOptionsComponent
            }
        ]);

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const events = application.getServiceEvents();
        const store = application.getStore();
        const searchButton = this._getSearchButton();

        events.on('system:uiElements:created', this._enableSearchButton.bind(this));
        store.on('store:searchCriteria:full:update', this._enableSearchButton.bind(this));

        searchButton.addEventListener('click', this._onSearchButtonClick.bind(this));
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
        })

        this.getView().innerHTML = 
        `<div class="search-pane"></div>
        <div class="no-select search-options-pane"></div>
        <div class="search-options-footer">
            <button class="search-options-search-button" type="button">
                <span>${Translations.getText('search.action')}</span>
            </button>
        </div>`;
    }

    _getSearchButton() {

        const sidebarComponent = this.getParentComponent();
        const sidebarView = sidebarComponent.getView();
        const sidebarContainer = sidebarView.getContainer();

        const searchButton = sidebarContainer.querySelector('.search-options-search-button');

        return searchButton;
    }

    _enableSearchButton() {

        const searchButton = this._getSearchButton();
        
        const isSomeSatellitesChecked = this._isSomeSatellitesChecked();

        if (isSomeSatellitesChecked) {
            searchButton.classList.remove('search-options-search-button-passive');        
            searchButton.classList.add('search-options-search-button-active');
        }
        else {
            searchButton.classList.remove('search-options-search-button-active');        
            searchButton.classList.add('search-options-search-button-passive');
        }
    }

    _isSomeSatellitesChecked() {

        const application = this.getApplication();
        const store = application.getStore();

        const searchCriteria = store.getData('searchCriteria');
        const {satellites: {pc = [], ms = []}} = searchCriteria;

        return ms.some(x => x.checked) || pc.some(x => x.checked);
    }

}