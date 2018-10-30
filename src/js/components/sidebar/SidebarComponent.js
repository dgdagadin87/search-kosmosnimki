import BaseCompositedComponent from '../../base/BaseCompositedComponent';

import Translations from 'scanex-translations';
import SidebarControl from  'scanex-leaflet-sidebar';

import { RESULT_MAX_COUNT_PLUS_ONE } from '../../config/constants/constants';

import {getTotalHeight} from '../../utils/commonUtils';
import {createDefaultCriteria} from './utils/utils';

import SearchTabComponent from './components/searchTab/SearchTabComponent';
import ResultsTabComponent from './components/resultsTab/ResultsTabComponent';
import ImageDetailsComponent from './components/imageDetails/ImageDetailsComponent';
import LimitDialogComponent from './components/limitDialog/LimitDialogComponent';


export default class SidebarComponent extends BaseCompositedComponent {

    init() {

        this._setDefaultCriteria();

        const map = this.getMap();

        this._view = new SidebarControl({position: 'topleft'});

        this._searchTabComponent = new SearchTabComponent({...this.getConfig(), parent: this});
        this._resultsTabComponent = new ResultsTabComponent({...this.getConfig(), parent: this});
        this._imageDetailsComponent = new ImageDetailsComponent({...this.getConfig(), parent: this});
        this._limitDialogComponent = new LimitDialogComponent({...this.getConfig(), parent: this});

        map.addControl(this.getView());

        this._endInitingSidebar();

        this._searchTabComponent.init();
        this._resultsTabComponent.init();
        this._imageDetailsComponent.init();
        this._limitDialogComponent.init();

        this._disableTabs();

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const globalEvents = application.getAppEvents();
        const map = application.getMap();
        const searchTabComponent = this.getChildComponent('searchTab');
        const resultsTabComponent = this.getChildComponent('resultsTab');

        this.getView().on('change', e => globalEvents.trigger('sidebar:tab:change', e));

        map.gmxDrawing.on('drawstop', () => this._setCurrentSearchTab());

        globalEvents.on('system:window:resize', () => this._resizeSidebar());
        globalEvents.on('system:components:created', () => this._resizeSidebar());
        globalEvents.on('sidebar:cart:limit', () => this._cartLimitMessage());

        searchTabComponent.events.on('searchButton:click', () => this._searchResults());
        resultsTabComponent.events.on('results:clear', () => this._clearResults());
        resultsTabComponent.events.on('imageDetails:show', (e, bBox) => this._showImageDetails(e, bBox));
    }

    _searchResults() {

        const application = this.getApplication();
        const store = application.getStore();
        const requestManager = application.getRequestManager();

        const searchCriteria = store.getData('searchCriteria');
        const {satellites: {pc = [], ms = []}} = searchCriteria;

        const hasCheckedSatellites = ms.some(x => x.checked) || pc.some(x => x.checked);

        if (!hasCheckedSatellites) {
            return false;
        }

        application.showLoader(true);

        this._clearResults();

        requestManager.requestSearchSnapshots(RESULT_MAX_COUNT_PLUS_ONE)
        .then(this._setSnapshotsData.bind(this));
    }

    _setSnapshotsData(result = {}) {

        const application = this.getApplication();
        const store = application.getStore();
        const view = this.getView();

        const SnapshotBridgeController = application.getBridgeController('snapshot');

        const isLoadingCancelled = store.getData('cancelLoading');

        if (!isLoadingCancelled) {

            const {values = []} = result;
            const resultLength = values.length;

            if (resultLength === 0) {

                const alertNothingMessage = Translations.getText('alerts.nothing');
                application.showNotification(alertNothingMessage);
            }
            else if (0 < resultLength && resultLength < RESULT_MAX_COUNT_PLUS_ONE) {

                SnapshotBridgeController.addContoursOnMapAndList(result);
                view.enable('results');
                view.setCurrent('results');
            }
            else {
                application.showNotification('В разработке');
                // if IsAuthenticated ? window.Catalog.dlgDownloadResult.show() : window.Catalog.dlgChangeResult.show()
            }
        }

        application.showLoader(false);

        store.rewriteData('cancelLoading', false);
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
        
        const application = this.getApplication();
        const store = application.getStore();
        const defaultCriteria = createDefaultCriteria();

        store.rewriteData('searchCriteria', defaultCriteria);
    }

    _resizeSidebar() {

        const application = this.getApplication();
        const appEvents = application.getAppEvents();

        const height = getTotalHeight([ '#header', '.leaflet-gmx-copyright' ]);

        document.body.querySelector('.scanex-sidebar').style.height = `${document.body.getBoundingClientRect().height - height}px`;
        appEvents.trigger('sidebar:tab:resize');
    }

    _disableTabs() {

        const view = this.getView();

        view.disable('results');
        view.disable('favourites');
    }

    _clearResults() {

        const application = this.getApplication();
        const SnapshotBridgeController = application.getBridgeController('snapshot');
        const view = this.getView();

        SnapshotBridgeController.clearSnapShotsOnResults();

        view.disable('results');
        view.setCurrent('search');
    }

    _showImageDetails(e, bBox) {

        const imageDetailsComponent = this.getChildComponent('imageDetails');
        imageDetailsComponent.toggle(e, bBox);
    }

    _cartLimitMessage() {

        const limitDialogComponent = this.getChildComponent('limitDialog');

        limitDialogComponent.show();
    }

}