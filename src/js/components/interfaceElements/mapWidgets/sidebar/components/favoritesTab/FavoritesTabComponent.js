import Translations from 'scanex-translations';

import BaseCompositedComponent from 'js/base/BaseCompositedComponent';

import ListComponent from './components/list/ListComponent';

import { getCorrectIndex } from 'js/utils/commonUtils';


export default class FavouritesTabComponent extends BaseCompositedComponent {

    init() {

        this._addTabToSidebar();
        this._createCartNumberPlace();

        this.initChildren([
            {
                index: 'list',
                constructor: ListComponent
            }
        ]);

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const store = application.getStore();
        const removeButton = this._getFavoritesRemoveButton();
        const orderButton = this._getFavoritesOrderButton();
        const ContourController = application.getBridgeController('contour');

        store.on('contours:addToCart', this._onAddToCartHandler.bind(this));
        store.on('contours:addAllToCart', this._onAddToCartHandler.bind(this));
        store.on('contours:setSelected', this._onSetSelectedHandler.bind(this));
        store.on('contours:setAllSelected', this._onSetSelectedHandler.bind(this));
        store.on('contours:removeSelectedFavorites', this._onAddToCartHandler.bind(this));

        removeButton.addEventListener('click', (e) => ContourController.removeSelectedFavoritesFromListAndMap(e));
        orderButton.addEventListener('click', (e) => this.events.trigger('makeOrder:click', e));
    }

    _addTabToSidebar() {

        this._view = this.getParentComponent().getView().addTab({
            id: 'favorites',            
            icon: 'sidebar-favorites',
            opened: 'sidebar-favorites-opened',
            closed: 'sidebar-favorites-closed',
            tooltip: Translations.getText('results.favorites')
        });

        this.getView().innerHTML = 
        `<div class="favorites-header">
            <span class="favorites-title">${Translations.getText('results.favorites')}</span>
            <span class="favorites-number">0</span>
            <div class="favorites-buttons">
                <i title="${Translations.getText('favorites.delete')}" class="favorites-delete-button"></i>
            </div>
        </div>
        <div class="favorites-pane"></div>
        <div class="favorites-footer">
            <div class="favorites-order-button">
                <div>${Translations.getText('cart.add')}</div>
            </div>
        </div>`;
    }

    _onSetSelectedHandler() {

        const application = this.getApplication();
        const store = application.getStore();
        const selectedIndex = getCorrectIndex('selected');

        const contours = store.getSerializedData('contours');
        const isSomeSelected = contours.some(item => {
            const {properties} = item;
            return properties[selectedIndex];
        });

        this._updateOrderAndRemoveButtons(isSomeSelected);
    }

    _onAddToCartHandler() {

        const application = this.getApplication();
        const store = application.getStore();
        const commonData = store.getFavorites();
        const dataLength = commonData.length;

        this._updateCartNumber(dataLength);
        this._updateOrderAndRemoveButtons(dataLength > 0);
    }

    _updateCartNumber(number) {

        const cartNumSpan = this._getCartNumberSpan();
        const innerNumSpan = this._getCartInnerNumberSpan();

        cartNumSpan.style.visibility = number > 0 ? 'visible' : 'hidden';

        cartNumSpan.innerText = number;
        innerNumSpan.innerText = number;
    }

    _updateOrderAndRemoveButtons(state) {

        const btnOrder = this._getFavoritesOrderButton();
        const btnDelete = this._getFavoritesRemoveButton();

        if (state) {
            btnOrder.classList.remove('favorites-order-button-passive');
            btnDelete.classList.remove('favorites-delete-button-passive');
            btnOrder.classList.add('favorites-order-button-active');
            btnDelete.classList.add('favorites-delete-button-active');
        }
        else {
            btnOrder.classList.remove('favorites-order-button-active');
            btnDelete.classList.remove('favorites-delete-button-active');
            btnOrder.classList.add('favorites-order-button-passive');
            btnDelete.classList.add('favorites-delete-button-passive');
        }
    }

    _createCartNumberPlace() {

        const container = document.body.querySelector('.scanex-sidebar [data-tab-id=favorites] .sidebar-favorites');
        let el = container.querySelector('.cart-number');
        if (el === null) {
            el = document.createElement('span');
            el.className = 'cart-number';
            el.style.visibility = 'hidden';
            container.appendChild (el);
        }
    }

    _getFavoritesOrderButton() {

        return document.body.querySelector('[data-pane-id=favorites] .favorites-order-button');
    }

    _getFavoritesRemoveButton() {

        return document.body.querySelector('[data-pane-id=favorites] .favorites-delete-button');
    }

    _getCartNumberSpan() {

        const sidebarComponent = this.getParentComponent();
        const sidebarView = sidebarComponent.getView();
        const sidebarContainer = sidebarView.getContainer();

        const cartNumSpan = sidebarContainer.querySelector('.cart-number');

        return cartNumSpan;
    }

    _getCartInnerNumberSpan() {

        const sidebarComponent = this.getParentComponent();
        const sidebarView = sidebarComponent.getView();
        const sidebarContainer = sidebarView.getContainer();

        const favoritesNumSpan = sidebarContainer.querySelector('.favorites-number');

        return favoritesNumSpan;
    }

}