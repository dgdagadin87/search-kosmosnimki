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

        return `${location.protocol}//${location.host}${location.pathname.substr(0, location.pathname.lastIndexOf('/'))}`;
    }

    getAuthManager() {

        return this._authManager;
    }

    createOrder(params = {}) {

        return this._catalogResourceServer.sendPostRequest('CreateOrder.ashx', params);
    }

    getCatalogResourceServer() {

        return this._catalogResourceServer;
    }

    getUserInfo() {

        return this._authManager.getUserInfo();
    }

}