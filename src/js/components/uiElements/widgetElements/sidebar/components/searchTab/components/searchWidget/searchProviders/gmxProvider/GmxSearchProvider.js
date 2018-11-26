import Translations from 'scanex-translations';

import BaseSearchProvider from '../base/BaseSearchProvider';

import GmxDataProvider from './_core/ProviderCore';


export default class GmxSearchProvider extends BaseSearchProvider {

    constructor(props) {

        super(props);

        const map = this.getMap();

        const application = this.getApplication();
        const requestManager = application.getRequestManager();

        this._provider = new GmxDataProvider({
            map,
            application,
            gmxResourceServer: requestManager.getGmxResourceServer()
        });

        this._bindEvents();
    }

    _bindEvents() {

        this._provider.addEventListener ('fetch', this._onFetchHandler.bind(this));
    }

    _onFetchHandler(e) {

        const application = this.getApplication();
        const ContourController = application.getBridgeController('contour');
        const {detail: result} = e;
        const {values = []} = result;

        if (values.length < 1) {
            const notificationText = Translations.getText('alerts.nothing');
            application.showNotification(notificationText);
            return;
        }

        ContourController.clearContoursOnResults();
        ContourController.addContoursOnMapAndList(result);
    }

}