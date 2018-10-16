import { getAuthManager, ResourceServer } from 'scanex-auth';


export default class AuthManagerService {

    constructor (config) {

        this._application = config.application;

        this._authManager = getAuthManager();

        this._catalogResourceServer = new ResourceServer(this._authManager, {
            id: 'Catalog',
            root: this._getAuthBaseUrl()
        });
    }

    _getAuthBaseUrl() {

        //return `${location.protocol}//${location.host}${location.pathname.substr(0, location.pathname.lastIndexOf('/'))}`;
        return `http://localhost/catalog/${location.pathname.substr(0, location.pathname.lastIndexOf('/'))}`;
    }

    getAuthManager() {

        return this._authManager;
    }

    getCatalogResourceServer() {

        return this._catalogResourceServer;
    }

    getUserInfo() {

        return this._authManager.getUserInfo();
    }

}