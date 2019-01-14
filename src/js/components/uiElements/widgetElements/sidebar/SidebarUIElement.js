import Translations from 'scanex-translations';

import BaseUIElement from 'js/base/BaseUIElement';

import {
    RESULT_MAX_COUNT_PLUS_ONE,
    ACCESS_USER_ROLE,
    HOME_LINK
} from 'js/config/constants/Constants';

import {getTotalHeight, getRootUrl} from 'js/utils/CommonUtils';
import {getProperty} from 'js/application/searchDataStore/SearchDataStore';

import SearchTabComponent from './components/searchTab/SearchTabComponent';
import ResultsTabComponent from './components/resultsTab/ResultsTabComponent';
import FavoritesTabComponent from './components/favoritesTab/FavoritesTabComponent';
import ImageDetailsComponent from './components/imageDetails/ImageDetailsComponent';

import View from './view/View';

import DownloadDialog from './dialogs/DownloadDialog';
import OrderDialog from './dialogs/OrderDialog';


export default class SidebarUIElement extends BaseUIElement {

    init() {

        const map = this.getMap();

        this._view = new View({ map });

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
            }
        ]);

        this._manageTabState('start');

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const serviceEvents = application.getServiceEvents();
        const globalEvents = application.getAppEvents();
        const store = application.getStore();
        const {gmxDrawing} = application.getMap();
        const contourController = application.getBridgeController('contour');
        const searchTabComponent = this.getChildComponent('searchTab');
        const resultsHeaderComponent = this.getChildComponent('resultsTab.header');
        const resutsListComponent = this.getChildComponent('resultsTab.list');
        const favoritesTabComponent = this.getChildComponent('favoritesTab');
        const favoritesListComponent = this.getChildComponent('favoritesTab.list');
        const sidebarView = this.getView();

        sidebarView.on('change', (e) => this._onTabChangeHandler(e));

        gmxDrawing.on('drawstop', () => this._manageTabState('stopDrawing'));

        store.on('contours:researchedList', () => this._manageTabState('addToResults'));
        store.on('contours:addToCartList', () => this._manageTabState('addToFavorites'));
        store.on('contours:addAllToCartList', () => this._manageTabState('addToFavorites'));
        store.on('contours:addVisibleToFavoritesList', () => this._manageTabState('addToFavorites'));
        store.on('contours:removeSelectedFavoritesList', () => this._manageTabState('clearFavorites'));

        globalEvents.on('system:window:resize', () => this._resizeSidebar());
        globalEvents.on('system:uiElements:created', () => this._resizeSidebar());
        serviceEvents.on('sidebar:cart:limit', () => this._cartLimitMessage());
        serviceEvents.on('sidebar:setCurrentTab', (tab) => this._manageTabState('applyAppState', tab));

        searchTabComponent.events.on('searchButton:click', () => this._searchResults());
        resultsHeaderComponent.events.on('results:clear', () => contourController.clearContoursOnResults());
        resultsHeaderComponent.events.on('filter:clear', () => contourController.clearClientFilter());
        resultsHeaderComponent.events.on('results:setVisibleToCart', () => contourController.setVisibleToCart());
        resutsListComponent.events.on('imageDetails:show', (e, bBox) => this._showImageDetails(e, bBox));
        resutsListComponent.events.on('filter:change', (e) => contourController.changeClientFilter(e));
        favoritesListComponent.events.on('imageDetails:show', (e, bBox) => this._showImageDetails(e, bBox));
        favoritesTabComponent.events.on('makeOrder:click', () => this._showOrderDialog());
    }

    _onTabChangeHandler(e) {

        const application = this.getApplication();
        const store = application.getStore();
        const {detail: {current: currentTab}} = e;

        store.setMetaItem('currentTab', currentTab, [
            'currentTab:changeUI',
            'currentTab:changeMap',
            'currentTab:changeMeta',
            'currentTab:changeAfter'
        ]);

        this._changeTabBorder(e);
    }

    _searchResults() {

        const application = this.getApplication();
        const store = application.getStore();
        const requestManager = application.getRequestManager();
        const contourController = application.getBridgeController('contour');

        const searchCriteria = store.getData('searchCriteria');
        const {satellites: {pc = [], ms = []}} = searchCriteria;

        const hasCheckedSatellites = ms.some(x => x.checked) || pc.some(x => x.checked);

        if (!hasCheckedSatellites) {
            return false;
        }

        application.showLoader(true);

        contourController.clearClientFilter();

        contourController.clearContoursOnResults();

        requestManager.requestSearchContours(RESULT_MAX_COUNT_PLUS_ONE)
        .then(this._setContoursData.bind(this))
        .catch(this._showError.bind(this));
    }

    _setContoursData(result = {}) {

        const application = this.getApplication();
        const store = application.getStore();
        const ContourController = application.getBridgeController('contour');
        const isLoadingCancelled = store.getMetaItem('cancelLoading');

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
                this._showDownloadDialog();
            }
        }

        application.showLoader(false);

        store.setMetaItem('cancelLoading', false);
    }

    _showDownloadDialog() {

        const application = this.getApplication();
        const modalComponent = application.getModal();

        modalComponent.show({
            component: DownloadDialog,
            data: { isAuthentificated: this._isUserIsAuthenticated() },
            events: {
                close: () => modalComponent.hide(),
                apply: () => {
                    modalComponent.hide();
                    this._onDownloadApplyClick();
                }
            }
        });
    }

    _showOrderDialog() {

        const application = this.getApplication();
        const store = application.getStore();
        const modalComponent = application.getModal();
        const appStateManager = application.getAddon('appStateManager');

        const showModal = data => {
            modalComponent.show({
                data,
                showClose: true,
                component: OrderDialog,
                events: {
                    login: () => this._onLoginButtonClick(),
                    warning: (permalink) => this._onWarningClick(permalink),
                    submit: ({dataToSend, view}) => this._onSubmitClick(dataToSend, view),
                    close: () => modalComponent.hide()
                }
            });
        };

        const userInfo = store.getData('userInfo');
        const inputValues = { ...userInfo, customer: '', project: '', number: '', comment: '' };
        const isAuthed = this._isUserIsAuthenticated();
        const isInternal = this._isUserIsInternal();
        const selectedCarts = store.getSelectedFavorites();

        if (selectedCarts.length < 1) {
            return;
        }

        let orderData = {
            inputValues,
            isAuthed,
            isInternal,
            items: selectedCarts.map(item => getProperty(item, 'sceneid')).join(',')
        };

        if (!isAuthed) {
            showModal(orderData);
            return;
        }

        appStateManager.getPermalinkId()
        .then(result => {
            orderData['permalink'] = `${getRootUrl()}?link=${result}`;
            showModal(orderData);
        })
        .catch(e => this._errorHandler(e))
    }

    _onLoginButtonClick() {

        const application = this.getApplication();
        const appStateManager = application.getAddon('appStateManager');
        const authContainer = document.getElementById('auth');
        const loginButton = authContainer.querySelector('.authWidget-loginButton');

        const currentAppState = appStateManager.getCurrentApplicationState();
        const savedState = appStateManager.getAppStateFromLocalStorage();
        if (!savedState) {
            appStateManager.saveAppStateToLocalStorage(currentAppState);
        }

        loginButton.click();
    }

    _onWarningClick(permalink) {

        const application = this.getApplication();
        const appStateManager = application.getAddon('appStateManager');
        const matches = /link=([^&]+)/g.exec(permalink);

        if (Array.isArray (matches) && matches.length > 0) {
            const permalinkId = matches[1];
            appStateManager.readPermalink(permalinkId)
            .then (response => {
                appStateManager.saveAppStateToLocalStorage(response);
                window.location = HOME_LINK;
            })
            .catch(error => window.console.error(error));
        }
        else {
            window.console.error('Permalink not set:' + permalink);
        }
    }

    _onSubmitClick(data, dialogView) {

        const application = this.getApplication();
        const requestManager = application.getRequestManager();
        
        requestManager.requestCreateOrder(data)
        .then(response => {

            const {Status: status} = response;

            if (status === 'ok') {                    
                dialogView.showSuccess();
            }
            else {
                alert('Error! Watch in console');
                window.console.error(response);
            }
        })
        .catch(error => {
            alert('Error! Watch in console');
            window.console.error(error);
        });
    }

    _isUserIsAuthenticated() {

        const application = this.getApplication();
        const store = application.getStore();
        const userInfo = store.getData('userInfo');

        return userInfo['IsAuthenticated'];
    }

    _isUserIsInternal() {

        const application = this.getApplication();
        const store = application.getStore();
        const userInfo = store.getData('userInfo');

        return userInfo['IsAuthenticated'] && userInfo['Role'] === ACCESS_USER_ROLE;
    }

    _resizeSidebar() {

        const application = this.getApplication();
        const events = application.getServiceEvents();
        const height = getTotalHeight([ '#header', '.leaflet-gmx-copyright' ]);
        const preparedHeight = `${document.body.getBoundingClientRect().height - height}px`;

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

    _showImageDetails(e, bBox) {

        const imageDetailsComponent = this.getChildComponent('imageDetails');
        imageDetailsComponent.toggle(e, bBox);
    }

    _cartLimitMessage() {

        const application = this.getApplication();
        const modalComponent = application.getModal();

        modalComponent.show({
            component: 'alert',
            messageText: Translations.getText('favorites.limit')
        });
    }

    _onDownloadApplyClick() {

        const application = this.getApplication();
        const store = application.getStore();
        const requestManager = application.getRequestManager();
        const shapeLoader = application.getAddon('shapeLoader');

        store.setMetaItem('cancelLoading', false);
        
        application.showLoader(true);

        requestManager.requestSearchContours()
        .then ((data) => {
            application.showLoader(false);

            const cancelLoading = store.getMetaItem('cancelLoading');

            if (!cancelLoading) {
                store.setDownloadCache(data);
                shapeLoader.download('results', 'results');
            }
        })
        .catch(this._showError.bind(this));
    }

    _manageTabState(state, tabName = false) {

        const application = this.getApplication();
        const store = application.getStore();
        const sidebar = this.getView();
    
        const hasResultData = store.hasResults();
        const hasFavoritesData = store.hasFavorites();
    
        if (state === 'start') {
            sidebar.disable('results');
            sidebar.disable('favorites');
            return;
        }

        if (state === 'applyAppState') {
            if (hasResultData) {
                sidebar.enable('results');
            }
            if (hasFavoritesData) {
                sidebar.enable('favorites');
            }
            sidebar.setCurrent(tabName);
            return;
        }
    
        if (state === 'stopDrawing') {
            if (!sidebar.getCurrent()) {
                sidebar.setCurrent('search');
            }
            return;
        }
    
        if (state === 'clearResults') {
            sidebar.disable('results');
            sidebar.setCurrent('search');
            return;
        }
    
        if (state === 'addToResults') {
            if (hasResultData) {
                sidebar.enable('results');
                sidebar.setCurrent('results');
            }
            else {
                sidebar.disable('results');
                sidebar.setCurrent('search');
            }
            return;
        }
    
        if (state === 'addToFavorites') {
            if (hasFavoritesData > 0) {
                sidebar.enable('favorites');
            }
            else {
                sidebar.disable('favorites');
                sidebar.setCurrent('results');
            }
            return;
        }
    
        if (state === 'clearFavorites') {
            if (hasFavoritesData) {
                sidebar.enable('favorites');
                sidebar.setCurrent('favorites');
            }
            else {
                sidebar.disable('favorites');
                const currentTab = hasResultData ? 'results' : 'search';
                sidebar.setCurrent(currentTab);
            }
            return;
        }
    }

    _showError(e) {

        const application = this.getApplication();
        const errorText = e.toString();

        application.showError(errorText);

        window.console.error(e);
    }

}