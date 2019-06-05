import BaseCompositedComponent from 'js/base/BaseCompositedComponent';

import HeaderComponent from './components/header/HeaderComponent';
import ListComponent from './components/list/ListComponent';
import TableHeaderComponent from './components/tableHeader/TableHeaderComponent';

import { TAB_RESULTS_NAME } from 'js/config/constants/Constants';

import View from './view/View';


export default class ResultTabComponent extends BaseCompositedComponent {

    init() {

        const parent = this.getParentComponent();
        const sidebarView = parent.getView();

        this._view = new View({
            sidebarView 
        });

        this.initChildren([
            {
                index: 'header',
                constructor: HeaderComponent
            },
            {
                index: 'tableHeader',
                constructor: TableHeaderComponent
            },
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
        const tableHeader = this.getChildComponent('tableHeader');
        const list = this.getChildComponent('list');

        store.on('currentTab:changeAfter', () => this._onAfterTabChangeHandler());
        tableHeader.events.on('sortGrid', (sortData) => list.sortGrid(sortData));
    }

    _onAfterTabChangeHandler() {

        const application = this.getApplication();
        const store = application.getStore();
        const currentTab = store.getMetaItem('currentTab');
        const resultsUpdated = store.getMetaItem('updateResults');

        if (currentTab === TAB_RESULTS_NAME && resultsUpdated) {
            store.setMetaItem('updateResults', false);
        }
    }

}