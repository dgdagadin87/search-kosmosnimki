import CatalogResourceServer from './catalogResourceServer/CatalogResourceServer';
import GmxResourceServer from './gmxResourceServer/GmxResourceServer';


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
    }

    // request methods
    requestGetUserInfo() {

        return this._catalogResourceComponent.getUserInfo();
    }

    requestVectorLayerSearch(params = {}) {

        return this._gmxResourceComponent.vectorLayerSearch(params);
    }

    requestGetLayerId(params = {}) {

        return this._gmxResourceComponent.getLayerId(params);
    }

    requestGetUserInfo() {

        return this._catalogResourceComponent.getUserInfo();
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