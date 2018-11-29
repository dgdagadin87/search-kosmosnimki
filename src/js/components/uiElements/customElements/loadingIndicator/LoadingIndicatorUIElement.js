import LoaderWidget from 'scanex-loader-widget';

import BaseUIElement from 'js/base/BaseUIElement';


export default class LoadingIndicatorUIElement extends BaseUIElement {

    init() {

        this._view = new LoaderWidget();

        this._bindEvents();
    }

    _bindEvents() {

        const view = this.getView();

        view.addEventListener('cancel', this._onCancelClickHandler.bind(this));
    }

    _onCancelClickHandler() {

        const application = this.getApplication();
        const store = application.getStore();

        store.setMetaItem('cancelLoading', true);
    }

    show(state = false) {

        const view = this.getView();
        const methodName = state ? 'show' : 'hide';

        view[methodName]();
    }

}