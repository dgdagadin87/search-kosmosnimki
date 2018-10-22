import Translations from 'scanex-translations';

import BaseCompositedComponent from '../../../../base/BaseCompositedComponent';

import SearchWidgetComponent from './components/searchWidget/SearchWidgetComponent';


export default class SearchTabComponent extends BaseCompositedComponent {

    constructor(props) {

        super(props);

        this._component = null;
    }

    init() {

        this._addTabToSidebar();

        this._searchWidgetComponent = new SearchWidgetComponent(this.getProps());

        this._searchWidgetComponent.init();
    }

    _addTabToSidebar() {

        this._component = this.getParentComponent()._component.addTab({
            id: 'search',
            icon: 'sidebar-search',
            opened: 'sidebar-search-opened',
            closed: 'sidebar-search-closed',
            tooltip: Translations.getText('search.title'), 
        })

        this._component.innerHTML = 
        `<div class="search-pane"></div>
        <div class="no-select search-options-pane"></div>
        <div class="search-options-footer">
            <button class="search-options-search-button" type="button">
                <span>${Translations.getText('search.action')}</span>
            </button>
        </div>`;
    }

}