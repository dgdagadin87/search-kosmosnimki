import BaseCompositedComponent from '../../base/BaseCompositedComponent';

import SidebarControl from  'scanex-leaflet-sidebar';

import {getTotalHeight} from '../../utils/commonUtils';

import { satellites } from '../../config/satellites/satellites';

import SearchTabComponent from './components/searchTab/SearchTabComponent';


export default class SidebarComponent extends BaseCompositedComponent {

    init() {

        this._setDefaultCriteria();

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

    _setDefaultCriteria() {

        const application = this.getApplication();
        const store = application.getStore();

        const now = new Date();

        const dateStart = new Date(now.getFullYear(), 0, 1);
        const dateEnd = now;

        const defaultCriteria = {
            date: [ dateStart, dateEnd ],
            annually: false,
            clouds: [0, 100],
            angle: [0, 60],
            resolution: [0.3, 20],
            satellites: satellites,
            stereo: false,
        };

        store.setChangeableData(
            'searchCriteria',
            defaultCriteria,
            { mode: 'full' }
        )
    }

    _resizeSidebar() {

        const height = getTotalHeight([ '#header', '.leaflet-gmx-copyright' ]);
        document.body.querySelector('.scanex-sidebar').style.height = `${document.body.getBoundingClientRect().height - height}px`;
    }

}