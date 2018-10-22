import Translations from 'scanex-translations';

import BaseCompositedComponent from '../../base/BaseCompositedComponent';

import SidebarControl from  'scanex-leaflet-sidebar';

import {getTotalHeight} from '../../utils/commonUtils';


export default class SidebarComponent extends BaseCompositedComponent {

    constructor(props) {

        super(props);

        this._component = new SidebarControl({position: 'topleft'});
    }

    init() {

        const map = this.getMap();

        map.addControl(this._component);

        this._component.getContainer().classList.add('noselect');

        this._addTabs();
    
        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const globalEvents = application.getAppEvents();

        globalEvents.on('components:created', () => this._resizeSidebar());
    }

    _addTabs() {

        this._addSearchTab();
    }

    _addSearchTab() {

        this._searchTabContainer = this._component.addTab({
            id: 'search',            
            icon: 'sidebar-search',
            opened: 'sidebar-search-opened',
            closed: 'sidebar-search-closed',
            tooltip: Translations.getText('search.title'),            
        });

        this._searchTabContainer.innerHTML = 
        `<div class="search-pane"></div>
        <div class="no-select search-options-pane"></div>
        <div class="search-options-footer">
            <button class="search-options-search-button" type="button">
                <span>${Translations.getText('search.action')}</span>
            </button>
        </div>`;
    }

    _resizeSidebar() {

        const height = getTotalHeight([ '#header', '.leaflet-gmx-copyright' ]);
        document.body.querySelector('.scanex-sidebar').style.height = `${document.body.getBoundingClientRect().height - height}px`;
        return height;
    }

}