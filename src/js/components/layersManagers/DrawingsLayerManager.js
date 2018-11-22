import BaseLayerManager from '../../base/BaseLayerManager';


export default class DrawingsLayerManager extends BaseLayerManager {

    constructor(props) {

        super(props);

        this._bindEvents();

        window.console.log('Drawings layer manager was initialized');
    }

    _bindEvents() {

        const {gmxDrawing} = this._map;
        const application = this.getApplication();

        const DrawingController = application.getBridgeController('drawing');

        gmxDrawing.on('drawstop', (rawItem) => DrawingController.addDrawingOnList(rawItem));
        gmxDrawing.on('editstop', (rawItem) => DrawingController.editDrawingOnList(rawItem));
        gmxDrawing.on('dragend', (rawItem) => DrawingController.editDrawingOnList(rawItem));
    }

}