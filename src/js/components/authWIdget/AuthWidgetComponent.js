import { AuthWidget } from 'scanex-auth';

import BaseComponent from '../../base/BaseComponent';


export default class AuthWidgetComponent extends BaseComponent {

    constructor(props){
        super(props);

        this._container = document.getElementById('auth');
    }

    init() {

        const application = this.getApplication();
        const catalogService = application.getService('catalogServer');
        const authManager = catalogService.getAuthManager();

        this._component = new AuthWidget({ authManager });
        this._component.appendTo(this._container);

        this._bindEvents();
    }

    _bindEvents() {

        this._component.addEventListener('logout', () => {
            //localStorage.setItem('view_state', JSON.stringify(get_state()));
            window.location.reload(true);
        });
    }

}