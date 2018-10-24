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

        this._endInitingSidebar();

        this._searchTabComponent.init();

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const globalEvents = application.getAppEvents();
        const map = application.getMap();

        const view = this.getView();
        const searchTabComponent = this.getChildComponent('searchTab');

        map.gmxDrawing.on('drawstop', () => this._setCurrentSearchTab());

        globalEvents.on('system:window:resize', () => this._resizeSidebar());
        globalEvents.on('system:components:created', () => this._resizeSidebar());

        view.on('change', e => globalEvents.trigger('sidebar:tab:change', e));

        searchTabComponent.events.on('searchButton:click', () => this._searchResults());
    }

    _searchResults() {

        const application = this.getApplication();
        const store = application.getStore();

        const searchCriteria = store.getData('searchCriteria');
        const {satellites: {pc = [], ms = []}} = searchCriteria;

        const hasCheckedSatellites = ms.some(x => x.checked) || pc.some(x => x.checked);

        if (!hasCheckedSatellites) {
            return false;
        }

        // show preloader
        application.showLoader(true);
        // set ignore results to false

        // clear result items (_result_index = false)

        // clear download cache
    }

    _setCurrentSearchTab() {

        const searchSidebar = this.getView();

        if (!searchSidebar.getCurrent()) {               
            searchSidebar.setCurrent('search');
        }
    }

    _endInitingSidebar() {

        const view = this.getView();
        const container = view.getContainer();

        container.classList.add('noselect');
    }

    _setDefaultCriteria() {

        const setSatellitesChecked = (group, flag) => {
            for (let key in group) {      
                let s = group[key];
                s.checked = flag;
            }
        };

        const application = this.getApplication();
        const store = application.getStore();

        const now = new Date();

        const dateStart = new Date(now.getFullYear(), 0, 1);
        const dateEnd = now;

        setSatellitesChecked(satellites.ms, true);
        setSatellitesChecked(satellites.pc, true);

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