import BaseCompositedComponent from '../../base/BaseCompositedComponent';

import SidebarControl from  'scanex-leaflet-sidebar';

import {getTotalHeight} from '../../utils/commonUtils';

import SearchTabComponent from './components/searchTab/SearchTabComponent';


export default class SidebarComponent extends BaseCompositedComponent {

    constructor(props) {

        super(props);

        this._component = new SidebarControl({position: 'topleft'});

        this._searchTabComponent = new SearchTabComponent({
            ...props,
            parent: this
        });
    }

    init() {

        const map = this.getMap();

        map.addControl(this._component);

        this._component.getContainer().classList.add('noselect');

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

        this._component.on('change', e => globalEvents.trigger('sidebar:tab:change', e));
    }

    _setCurrentSearchTab() {

        const searchSidebar = this._component;

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
        return height;
    }

}