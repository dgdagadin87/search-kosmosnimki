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

        const mapAndUiGateway = application.getGateway();

        const componentWidget = this.getView().widget;

        store.on('drawings:updateList', this._updateList.bind(this));

        componentWidget.addEventListener('editDrawing', (e) => mapAndUiGateway.editDrawingOnMapAndList(e));
        componentWidget.addEventListener('zoomToObject', (e) => mapAndUiGateway.zoomToDrawingOnMap(e));

        componentWidget.addEventListener('toggleDrawing', (e, mode = 'row') => mapAndUiGateway.toggleDrawingsOnMapAndList(e, mode));
        componentWidget.addEventListener('toggleAllDrawings', (e, mode = 'all') => mapAndUiGateway.toggleDrawingsOnMapAndList(e, mode));
        componentWidget.addEventListener('deleteDrawing', (e, mode = 'row') => mapAndUiGateway.deleteDrawingsOnMapAndList(e, mode));
        componentWidget.addEventListener('deleteAllDrawings', (e, mode = 'all') =>mapAndUiGateway.deleteDrawingsOnMapAndList(e, mode));
    }

    _updateList() {

        const application = this.getApplication();
        const store = application.getStore();

        const drawingObjectsItems = store.getData('drawings');
        const data = Object.keys(drawingObjectsItems).map(id => drawingObjectsItems[id]);

        this.getView().widget.items = data;

        this._resizeWidget();
    }

    _resizeWidget() {

        const app = this.getApplication();

        const { height } =  app.getMapContainer().getBoundingClientRect();
        this.getView().widget.resize(height - 150);
    }

}