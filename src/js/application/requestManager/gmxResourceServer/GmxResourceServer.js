import { getResourceServer } from 'scanex-auth';


export default class GmxResourceServerService {

    constructor(config) {

        this._application = config.application;

        this._gmxResourceService = getResourceServer('geomixer');
    }

    getGmxResourceServer() {

        return this._gmxResourceService;
    }

    getLayerId(params = {}) {

        return this._gmxResourceService.sendGetRequest('Layer/GetLayerInfo.ashx', params);
    }

    vectorLayerSearch(params = {}) {

        return this._gmxResourceService.sendPostRequest('VectorLayer/Search.ashx', params);
    }

    makeFile(url, params = {}) {

        return this._gmxResourceService.sendPostRequest(url, params);
    }

    downloadCommonFile(url) {

        return this._gmxResourceService.sendPostRequest(url);
    }

    createPermalink(params = {}) {

        return this._gmxResourceService.sendPostRequest('TinyReference/Create.ashx', params);
    }

}