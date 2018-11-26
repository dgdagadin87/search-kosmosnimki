import BaseUIElement from 'js/base/BaseUIElement';

import View from './view/View';


export default class DrawingObjectsUIElement extends BaseUIElement {

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

        const DrawingController = application.getBridgeController('drawing');

        const componentWidget = this._view.widget;

        store.on('drawings:updateList', this._updateList.bind(this));

        componentWidget.addEventListener('editDrawing', (e) => DrawingController.editDrawingOnMapAndList(e));
        componentWidget.addEventListener('zoomToObject', (e) => DrawingController.zoomToDrawingOnMap(e));

        componentWidget.addEventListener('toggleDrawing', (e, mode = 'row') => DrawingController.toggleDrawingsOnMapAndList(e, mode));
        componentWidget.addEventListener('toggleAllDrawings', (e, mode = 'all') => DrawingController.toggleDrawingsOnMapAndList(e, mode));
        componentWidget.addEventListener('deleteDrawing', (e, mode = 'row') => DrawingController.deleteDrawingsOnMapAndList(e, mode));
        componentWidget.addEventListener('deleteAllDrawings', (e, mode = 'all') => DrawingController.deleteDrawingsOnMapAndList(e, mode));
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