import BaseCompositedComponent from 'js/base/BaseCompositedComponent';

import HeaderComponent from './components/header/HeaderComponent';
import ListComponent from './components/list/ListComponent';

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
                index: 'list',
                constructor: ListComponent
            }
        ]);

        this._bindEvents();
    }

    _bindEvents() {}

}