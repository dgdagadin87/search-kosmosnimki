import BaseComponent from '../../base/BaseComponent';

import { DrawnObjectsControl } from './view/DrawnObjects';


export default class DrawingObjectsComponent extends BaseComponent {

    init() {

        const map = this.getMap();

        this._view = new DrawnObjectsControl({position: 'topright'});

        map.addControl(this.getView());

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const store = application.getStore();

        const DrawingBridgeController = application.getBridgeController('drawing');

        const componentWidget = this.getView().widget;

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

        const app = this.getApplication();

        const { height } =  app.getMapContainer().getBoundingClientRect();
        this.getView().widget.resize(height - 150);
    }

}