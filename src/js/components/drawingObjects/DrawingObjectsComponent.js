import BaseComponent from '../../base/BaseComponent';

import View from './view/View';


export default class DrawingObjectsComponent extends BaseComponent {

    init() {

        const map = this.getMap();
        const application = this.getApplication();

        this._view = new View({
            map,
            application,
            position: 'topright'
        });

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const store = application.getStore();

        const DrawingBridgeController = application.getBridgeController('drawing');

        const componentWidget = this._view.widget;

        store.on('drawings:updateList', this._updateList.bind(this));

        componentWidget.addEventListener('editDrawing', (e) => DrawingBridgeController.editDrawingOnMapAndList(e));
        componentWidget.addEventListener('zoomToObject', (e) => DrawingBridgeController.zoomToDrawingOnMap(e));

        componentWidget.addEventListener('toggleDrawing', (e, mode = 'row') => DrawingBridgeController.toggleDrawingsOnMapAndList(e, mode));
        componentWidget.addEventListener('toggleAllDrawings', (e, mode = 'all') => DrawingBridgeController.toggleDrawingsOnMapAndList(e, mode));
        componentWidget.addEventListener('deleteDrawing', (e, mode = 'row') => DrawingBridgeController.deleteDrawingsOnMapAndList(e, mode));
        componentWidget.addEventListener('deleteAllDrawings', (e, mode = 'all') => DrawingBridgeController.deleteDrawingsOnMapAndList(e, mode));
    }

    _updateList() {

        const application = this.getApplication();
        const store = application.getStore();
        const data = store.getSerializedData('drawings');

        this.getView().widget.items = data;

        this._resizeWidget();
    }

    _resizeWidget() {

        const view = this.getView();

        view.resizeDrawings();
    }

}