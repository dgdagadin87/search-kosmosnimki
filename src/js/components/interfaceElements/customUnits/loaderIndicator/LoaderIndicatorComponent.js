import LoaderWidget from 'scanex-loader-widget';

import BaseComponent from 'js/base/BaseComponent';


export default class LoaderIndicatorComponent extends BaseComponent {

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

        store.rewriteData('cancelLoading', true, ['store:cancelLoading:full:update']);
    }

    show(state = false) {

        const view = this.getView();
        const methodName = state ? 'show' : 'hide';

        view[methodName]();
    }

}