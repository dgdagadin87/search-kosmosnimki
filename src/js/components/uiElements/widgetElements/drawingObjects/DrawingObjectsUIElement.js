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
        const view = this._view.widget;

        store.on('drawings:updateList', this._updateList.bind(this));
        store.on('drawings:redrawItem', this._redrawItemOnList.bind(this));

        view.addEventListener('editDrawing', (e) => DrawingController.editDrawingOnMapAndList(e));
        view.addEventListener('zoomToObject', (e) => DrawingController.zoomToDrawingOnMap(e));
        view.addEventListener('toggleDrawing', (e, mode = 'row') => DrawingController.toggleDrawingsOnMapAndList(e, mode));
        view.addEventListener('toggleAllDrawings', (e, mode = 'all') => DrawingController.toggleDrawingsOnMapAndList(e, mode));
        view.addEventListener('deleteDrawing', (e, mode = 'row') => DrawingController.deleteDrawingsOnMapAndList(e, mode));
        view.addEventListener('deleteAllDrawings', (e, mode = 'all') => DrawingController.deleteDrawingsOnMapAndList(e, mode));
    }

    _updateList() {

        const application = this.getApplication();
        const store = application.getStore();
        const data = store.getSerializedData('drawings');

        this.getView().widget.items = data;

        this._resizeWidget();
    }

    _redrawItemOnList(itemId) {

        const application = this.getApplication();
        const store = application.getStore();
        const view = this.getView();

        const itemData = store.getData('drawings', itemId);

        view.widget.redrawItem(itemId, itemData);
    }

    _resizeWidget() {

        const view = this.getView();

        view.resizeDrawings();
    }

}