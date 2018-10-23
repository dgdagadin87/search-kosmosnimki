import Translations from 'scanex-translations';

import BaseCompositedComponent from '../../../../base/BaseCompositedComponent';

import SearchWidgetComponent from './components/searchWidget/SearchWidgetComponent';


export default class SearchTabComponent extends BaseCompositedComponent {

    init() {

        this._addTabToSidebar();

        this._searchWidgetComponent = new SearchWidgetComponent(this.getConfig());

        this._searchWidgetComponent.init();
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

}