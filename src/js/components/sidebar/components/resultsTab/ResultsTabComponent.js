import Translations from 'scanex-translations';

import BaseCompositedComponent from '../../../../base/BaseCompositedComponent';

import HeaderComponent from './components/header/HeaderComponent';
import ListComponent from './components/list/ListComponent';


export default class ResultTabComponent extends BaseCompositedComponent {

    init() {

        this._addTabToSidebar();

        this.initChildren([
            {
                index: 'header',
                constructor: HeaderComponent
            },
            {
                index: 'list',
                constructor: ListComponent
            }
        ]);

        this._bindEvents();
    }

    _bindEvents() {}

    _addTabToSidebar() {

        this._view = this.getParentComponent().getView().addTab({
            id: 'results',            
            icon: 'sidebar-results',
            opened: 'sidebar-results-opened',
            closed: 'sidebar-results-closed',
            tooltip: Translations.getText('results.title')
        })
    }

}