import LoaderWidget from 'scanex-loader-widget';

import BaseComponent from '../../base/BaseComponent';


export default class LoaderWidgetComponent extends BaseComponent {

    init() {

        this._view = new LoaderWidget ();

        this._bindEvents();
    }

    _bindEvents() {

        const view = this.getView();

        view.addEventListener('cancel', this._onCancelClickHandler.bind(this));
    }

    _onCancelClickHandler() {

        const application = this.getApplication();
        const store = application.getStore();

        store.setChangeableData('cancelLoading', true, {events: ['store:cancelLoading:full:update']});
    }

    show(state = false) {

        const view = this.getView();
        const methodName = state ? 'show' : 'hide';

        view[methodName]();
    }

}