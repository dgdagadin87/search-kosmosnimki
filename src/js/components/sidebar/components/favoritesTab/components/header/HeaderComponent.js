import BaseComponent from '../../../../../../base/BaseComponent';

import View from './view/View';


export default class HeaderComponent extends BaseComponent {

    init() {

        const parentComponent = this.getParentComponent();

        this._view = new View({
            parent: parentComponent
        });

        this._bindEvents();
    }

    _bindEvents() {

        
    }

    _getCartInnerNumberSpan() {

        const view = this.getView();

        return view.getCartInnerNumberSpan();
    }

    _getFavoritesRemoveButton() {

        const view = this.getView();

        return view.getFavoritesRemoveButton();
    }
}