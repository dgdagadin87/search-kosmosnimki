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

}