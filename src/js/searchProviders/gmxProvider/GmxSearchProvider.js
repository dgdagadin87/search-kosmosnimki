import BaseSearchProvider from '../../base/BaseSearchProvider';

import GmxDataProvider from './_core/ProviderCore';


export default class GmxSearchProvider extends BaseSearchProvider {

    constructor(props) {

        super(props);

        const map = this.getMap();

        const application = this.getApplication();
        const gmxService = application.getService('gmxServer');

        this._provider = new GmxDataProvider({
            map,
            gmxResourceServer: gmxService
        });

        this._bindEvents();
    }

    _bindEvents() {

        this._provider.addEventListener ('fetch', this._onFetchHandler.bind(this));
    }

    _onFetchHandler(e) {

        /*let {fields, values, types} = e.detail;
        const count = values.length;                            
        if (count === 0) {
            // window.Catalog.searchSidebar.enable ('results', false);
            window.Catalog.searchSidebar.disable ('results');
            update_results_number(0);
            window.Catalog.notificationWidget.content.innerText = T.getText('alerts.nothing');
            window.Catalog.notificationWidget.show();
        }
        else {
            window.Catalog.resultsController.clear();
            // window.Catalog.searchSidebar.enable ('results', true);
            // window.Catalog.searchSidebar.open('results');
            window.Catalog.searchSidebar.enable ('results');
            window.Catalog.searchSidebar.setCurrent('results');
            window.Catalog.resultsController.setLayer({fields,values,types});
            update_results_number(count);
        }*/
    }

}