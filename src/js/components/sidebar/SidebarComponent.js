import BaseCompositedComponent from '../../base/BaseCompositedComponent';

import SidebarControl from  'scanex-leaflet-sidebar';

import {getTotalHeight} from '../../utils/commonUtils';

import SearchTabComponent from './components/searchTab/SearchTabComponent';


export default class SidebarComponent extends BaseCompositedComponent {

    init() {

        const map = this.getMap();

        this._view = new SidebarControl({position: 'topleft'});

        this._searchTabComponent = new SearchTabComponent({
            ...this.getConfig(),
            parent: this
        });

        map.addControl(this.getView());

        this.getView().getContainer().classList.add('noselect');

        this._searchTabComponent.init();
    
        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const globalEvents = application.getAppEvents();

        const map = application.getMap();
        const {gmxDrawing} = map;

        globalEvents.on('components:created', () => this._resizeSidebar());
        
        gmxDrawing.on('drawstop', () => this._setCurrentSearchTab());

        window.addEventListener('resize', () => this._resizeSidebar());

        this.getView().on('change', e => globalEvents.trigger('sidebar:tab:change', e));
    }

    _setCurrentSearchTab() {

        const searchSidebar = this.getView();

        if (!searchSidebar.getCurrent()) {               
            searchSidebar.setCurrent('search');
        }
    }

    _addTabs() {

        this._addSearchTab();
    }

    _addSearchTab() {

        
    }

    _resizeSidebar() {

        const height = getTotalHeight([ '#header', '.leaflet-gmx-copyright' ]);
        document.body.querySelector('.scanex-sidebar').style.height = `${document.body.getBoundingClientRect().height - height}px`;
    }

}