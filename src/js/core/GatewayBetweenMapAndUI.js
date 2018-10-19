export default class GatewayBetweenMapAndInterface {

    constructor(config) {

        const {application} = config;

        this._application = application;
    }

    getApplication() {

        return this._application;
    }

}