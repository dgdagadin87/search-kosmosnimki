import CatalogResourceServer from './catalogResourceServer/CatalogResourceServer';
import GmxResourceServer from './gmxResourceServer/GmxResourceServer';
import RequestAdapter from './requestAdapter/RequestAdapter';


export default class RequestManager {

    constructor(config) {

        const {map, application} = config;

        this._application = application;
        this._map = map;

        this._catalogResourceComponent = new CatalogResourceServer({
            application
        });

        this._gmxResourceComponent = new GmxResourceServer({
            application
        });

        this._requestAdapterComponent = new RequestAdapter({
            application,
            gmxResourceServer: this.getGmxResourceServer()
        });
    }

    // request methods
    requestGetUserInfo() {

        return this._catalogResourceComponent.getUserInfo();
    }

    requestSearchContours(limit = 0) {

        return this._requestAdapterComponent.searchContours(limit);
    }

    requestVectorLayerSearch(params = {}) {

        return this._gmxResourceComponent.vectorLayerSearch(params);
    }

    requestGetLayerId(params = {}) {

        return this._gmxResourceComponent.getLayerId(params);
    }

    requestMakeFile(url, params = {}) {

        return this._gmxResourceComponent.makeFile(url, params);
    }

    requestCreateOrder(params = {}) {

        return this._catalogResourceComponent.createOrder(params);
    }

    requestGetShapeMetadata(url, params = {}) {

        return this._catalogResourceComponent.getShapeMetadata(url, params);
    }

    requestDownloadCsvFile(url, params = {}) {

        return this._catalogResourceComponent.downloadCsvFile(url, params);
    }

    requestDownloadCommonFile(url) {

        return this._gmxResourceComponent.downloadCommonFile(url);
    }

    requestCreatePermalink(params = {}) {

        return this._gmxResourceComponent.createPermalink(params);
    }

    requestShapeLoader(url, params = {}) {

        return fetch(url, params);
    }

    requestIdLoader(url, params = {}) {

        return fetch(url, params);
    }

    // service methods
    getAuthManager() {

        return this._catalogResourceComponent.getAuthManager();
    }

    getCatalogResourceServer() {

        return this._catalogResourceComponent.getCatalogResourceServer();
    }

    getGmxResourceServer() {

        return this._gmxResourceComponent.getGmxResourceServer();
    }

}