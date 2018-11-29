import Translations from 'scanex-translations';

import BaseUIElement from 'js/base/BaseUIElement';

import { RESULT_MAX_COUNT_PLUS_ONE } from 'js/config/constants/constants';

import {getTotalHeight} from 'js/utils/commonUtils';
import {createDefaultCriteria, manageTabsState} from './utils/utils';

import SearchTabComponent from './components/searchTab/SearchTabComponent';
import ResultsTabComponent from './components/resultsTab/ResultsTabComponent';
import FavoritesTabComponent from './components/favoritesTab/FavoritesTabComponent';
import ImageDetailsComponent from './components/imageDetails/ImageDetailsComponent';
import LimitDialogComponent from './components/limitDialog/LimitDialogComponent';
import DownloadDialogComponent from './components/downloadDialog/DownloadDialogComponent';

import View from './view/View';


export default class SidebarUIElement extends BaseUIElement {

    init() {

        this._setDefaultCriteria();

        const map = this.getMap();
        const application = this.getApplication();
        const store = application.getStore();

        this._view = new View({
            map
        });

        this.initChildren([
            {
                index: 'searchTab',
                constructor: SearchTabComponent
            },
            {
                index: 'resultsTab',
                constructor: ResultsTabComponent
            },
            {
                index: 'favoritesTab',
                constructor: FavoritesTabComponent
            },
            {
                index: 'imageDetails',
                constructor: ImageDetailsComponent
            },
            {
                index: 'limitDialog',
                constructor: LimitDialogComponent
            },
            {
                index: 'downloadDialog',
                constructor: DownloadDialogComponent
            }
        ]);

        manageTabsState(this._view, store, 'start');

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const serviceEvents = application.getServiceEvents();
        const globalEvents = application.getAppEvents();
        const store = application.getStore();
        const {gmxDrawing} = application.getMap();
        const searchTabComponent = this.getChildComponent('searchTab');
        const resultsHeaderComponent = this.getChildComponent('resultsTab.header');
        const resutsListComponent = this.getChildComponent('resultsTab.list');
        const favoritesTabComponent = this.getChildComponent('favoritesTab');
        const favoritesListComponent = this.getChildComponent('favoritesTab.list');
        const downloadDialogComponent = this.getChildComponent('downloadDialog');
        const view = this.getView();

        view.on('change', (e) => {
            serviceEvents.trigger('sidebar:tab:change', e);
            serviceEvents.trigger('sidebar:tab:change:map', e);
            this._changeTabBorder(e);
        });

        gmxDrawing.on('drawstop', () => manageTabsState(view, store, 'stopDrawing'));

        store.on('contours:researchedList', () => manageTabsState(view, store, 'addToResults'));
        store.on('contours:addToCartList', () => manageTabsState(view, store, 'addToFavorites'));
        store.on('contours:addAllToCartList', () => manageTabsState(view, store, 'addToFavorites'));
        store.on('contours:addVisibleToFavoritesList', () => manageTabsState(view, store, 'addToFavorites'));
        store.on('contours:removeSelectedFavoritesList', () => manageTabsState(view, store, 'clearFavorites'));

        globalEvents.on('system:window:resize', () => this._resizeSidebar());
        globalEvents.on('system:uiElements:created', () => this._resizeSidebar());
        serviceEvents.on('sidebar:cart:limit', () => this._cartLimitMessage());

        searchTabComponent.events.on('searchButton:click', () => this._searchResults());
        resultsHeaderComponent.events.on('results:clear', () => this._clearResults());
        resultsHeaderComponent.events.on('results:setVisibleToFavorites', () => this._setVisibleToCart());
        resutsListComponent.events.on('imageDetails:show', (e, bBox) => this._showImageDetails(e, bBox));
        favoritesListComponent.events.on('imageDetails:show', (e, bBox) => this._showImageDetails(e, bBox));
        favoritesTabComponent.events.on('makeOrder:click', (e, bBox) => this._onMakeOrderClick(e, bBox));
        downloadDialogComponent.events.on('downloadApply:click', () => this._onDownloadApplyClick());

        //serviceEvents.on('contours:showQuicklookList', this._redrawItemOnList.bind(this));
        //store.on('contours:showQuicklookList', this._redrawItemOnList.bind(this));
    }

    _redrawItemOnList() {
        console.log('redraweddd');
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

        requestManager.requestSearchContours(RESULT_MAX_COUNT_PLUS_ONE)
        .then(this._setContoursData.bind(this))
        .catch(this._showError.bind(this));
    }

    _setContoursData(result = {}) {

        const application = this.getApplication();
        const store = application.getStore();
        const ContourController = application.getBridgeController('contour');
        const downloadDialogComponent = this.getChildComponent('downloadDialog');
        const isLoadingCancelled = store.getData('cancelLoading');

        if (!isLoadingCancelled) {

            const {values = []} = result;
            const resultLength = values.length;

            if (resultLength === 0) {

                const alertNothingMessage = Translations.getText('alerts.nothing');
                application.showNotification(alertNothingMessage);
            }
            else if (0 < resultLength && resultLength < RESULT_MAX_COUNT_PLUS_ONE) {

                ContourController.addContoursOnMapAndList(result);
            }
            else {

                downloadDialogComponent.show();
            }
        }

        application.showLoader(false);

        store.rewriteData('cancelLoading', false);
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
        const events = application.getServiceEvents();
        const height = getTotalHeight([ '#header', '.leaflet-gmx-copyright' ]);
        const preparedHeight = `${document.body.getBoundingClientRect().height - height}px`

        document.body.querySelector('.scanex-sidebar').style.height = preparedHeight;
        events.trigger('sidebar:tab:resize');
    }

    _changeTabBorder(e) {

        const {detail: {current}} = e;
        const tabs = document.querySelectorAll('.tabs > div');

        tabs.forEach(tab => tab.classList.remove('active-sidebar-tab'));
        if (current) {
            const currentTab = document.querySelector('[data-tab-id="' + current + '"]');
            currentTab.classList.add('active-sidebar-tab');
        }
    }

    _clearResults() {

        const application = this.getApplication();
        const ContourController = application.getBridgeController('contour');

        ContourController.clearContoursOnResults();
    }

    _setVisibleToCart() {

        const application = this.getApplication();
        const ContourController = application.getBridgeController('contour');

        ContourController.setVisibleToCart();
    }

    _showImageDetails(e, bBox) {

        const imageDetailsComponent = this.getChildComponent('imageDetails');
        imageDetailsComponent.toggle(e, bBox);
    }

    _onMakeOrderClick(e) {

        const application = this.getApplication();
        const events = application.getServiceEvents();

        events.trigger('makeOrder:click', e);
    }

    _cartLimitMessage() {

        const limitDialogComponent = this.getChildComponent('limitDialog');

        limitDialogComponent.show();
    }

    _onDownloadApplyClick() {

        const application = this.getApplication();
        const store = application.getStore();
        const requestManager = application.getRequestManager();
        const shapeLoader = application.getAddon('shapeLoader');
        const downloadDialogComponent = this.getChildComponent('downloadDialog');

        store.rewriteData('cancelLoading', false);

        downloadDialogComponent.hide();
        
        application.showLoader(true);

        requestManager.requestSearchContours()
        .then ((data) => {

            application.showLoader(false);

            const cancelLoading = store.getData('cancelLoading');

            if (!cancelLoading) {

                store.setDownloadCache(data);
                shapeLoader.download('results', 'results');
            }                
        })
        .catch(this._showError.bind(this));
    }

    _showError(e) {

        const application = this.getApplication();
        const errorText = e.toString();

        application.showError(errorText);

        window.console.error(e);
    }

}