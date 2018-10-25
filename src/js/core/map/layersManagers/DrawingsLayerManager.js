import BaseLayerManager from '../../../base/BaseLayerManager';


export default class DrawingsLayerManager extends BaseLayerManager {

    constructor(props) {

        super(props);

        this._bindEvents();

        window.console.log('Drawings layer manager was initialized');
    }

    _bindEvents() {

        const {gmxDrawing} = this._map;
        const application = this.getApplication();

        const mapAndUiGateway = application.getGateway();

        gmxDrawing.on('drawstop', (rawItem) => mapAndUiGateway.addDrawingOnList(rawItem));
        gmxDrawing.on('editstop', (rawItem) => mapAndUiGateway.editDrawingOnList(rawItem));
        gmxDrawing.on('dragend', (rawItem) => mapAndUiGateway.editDrawingOnList(rawItem));
    }

}