import BaseMapManager from '../../base/BaseMapManager';


export default class DrawingsMapManager extends BaseMapManager {

    constructor(props) {

        super(props);

        this._bindEvents();
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