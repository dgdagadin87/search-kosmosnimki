import Translations from 'scanex-translations';

import BaseCompositedComponent from '../../../../base/BaseCompositedComponent';

import FavoriteListComponent from './components/favoritesList/FavoritesListComponent';

import { propertiesToItem, getCorrectIndex } from '../../../../utils/commonUtils';
import SnapshotBridgeController from '../../../../core/bridgeControllers/SnapshotBridgeController';


export default class FavouritesTabComponent extends BaseCompositedComponent {

    init() {

        this._addTabToSidebar();
        this._createCartNumberPlace();

        this._favoritesListComponent = new FavoriteListComponent(this.getConfig());

        this._favoritesListComponent.init();

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const store = application.getStore();
        const favoritesComponent = this.getChildComponent('favoritesList');
        const removeButton = this._getFavoritesRemoveButton();
        const SnapshotBridgeController = application.getBridgeController('snapshot');

        store.on('snapshots:addToCart', this._onAddToCartHandler.bind(this));
        store.on('snapshots:addAllToCart', this._onAddToCartHandler.bind(this));
        store.on('snapshots:setSelected', this._onSetSelectedHandler.bind(this));
        store.on('snapshots:setAllSelected', this._onSetSelectedHandler.bind(this));
        store.on('snapshots:removeSelectedFavorites', this._onAddToCartHandler.bind(this));

        removeButton.addEventListener('click', (e) => SnapshotBridgeController.removeSelectedFavoritesFromListAndMap(e));
        favoritesComponent.events.on('imageDetails:show', (e, bBox) => this.events.trigger('imageDetails:show', e, bBox));
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

        const snapshots = store.getSerializedData('snapshots');
        const isSomeSelected = snapshots.some(item => {
            const {properties} = item;
            return properties[selectedIndex];
        });

        this._updateOrderAndRemoveButtons(isSomeSelected);
    }

    _onAddToCarthHandler() {

        const application = this.getApplication();
        const store = application.getStore();

        const snapshotItems = store.getData('snapshots');
        const commonData = Object.keys(snapshotItems).map((id) => {
            
            const item = snapshotItems[id];
            const {properties} = item;

            return propertiesToItem(properties);
        });
        const filteredData = commonData.filter(item => item.cart);

        const dataLength = filteredData.length;

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