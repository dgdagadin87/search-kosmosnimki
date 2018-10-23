import BaseComponent from '../../base/BaseComponent';

import { DrawnObjectsControl } from './view/DrawnObjects';

import { getDrawingObject, getDrawingObjectArea } from '../../utils/layersUtils';


export default class DrawingObjectsComponent extends BaseComponent {

    init() {

        const map = this.getMap();

        this._view = new DrawnObjectsControl({position: 'topright'});

        map.addControl(this.getView());

        this._bindEvents();
    }

    _bindEvents() {

        const app = this.getApplication();
        const store = app.getStore();
        const appEvents = app.getAppEvents();

        const componentWidget = this.getView().widget;
        
        appEvents.on('drawingObjects:updateList', this._updateList.bind(this));
        appEvents.on('drawingObjects:addDrawingOnList', this._addDrawingOnList.bind(this));
        appEvents.on('drawingObjects:editDrawingOnList', this._editDrawingOnList.bind(this));

        store.on('drawings:row:add:ui', this._updateList.bind(this));
        store.on('drawings:row:update:ui', this._updateList.bind(this));
        store.on('drawings:row:delete:ui', this._updateList.bind(this));

        componentWidget.addEventListener('editDrawing', (e) => this._editDrawing(e));
        componentWidget.addEventListener('zoomToObject', (e) => this._zoomToObjectOnMap(e));

        componentWidget.addEventListener('toggleDrawing', (e, mode = 'row') => this._toggleDrawings(e, mode));
        componentWidget.addEventListener('toggleAllDrawings', (e, mode = 'all') => this._toggleDrawings(e, mode));
        componentWidget.addEventListener('deleteDrawing', (e, mode = 'row') => this._deleteDrawings(e, mode));
        componentWidget.addEventListener('deleteAllDrawings', (e, mode = 'all') => this._deleteDrawings(e, mode));
    }

    _addDrawingOnList(rawItem) {

        const {object, geoJSON} = rawItem;

        const drawingId = object.options.uuid || L.gmxUtil.newId();

        const app = this.getApplication();
        const store = app.getStore();

        const drawing = store.getChangeableData('drawings', {
            mode: 'row',
            rowId: drawingId
        });

        if (!drawing) {

            object.options.uuid = drawingId;

            let color = L.GmxDrawing.utils.defaultStyles.lineStyle.color;

            switch (object.options.type) {
                case 'Polygon':
                case 'Polyline':
                case 'Rectangle':
                    color = object.options.lineStyle.color;
                    break;
                default:
                    break;
            }

            const GeoJSON = geoJSON || object.toGeoJSON();

            const drawingObject = getDrawingObject({
                id: object.options.uuid,                
                name: null,
                geoJSON: GeoJSON, 
                color,
                visible: true,
            });
            drawingObject['drawing'] = object;

            store.setChangeableData(
                'drawings', drawingObject,
                { mode: 'row', operation: 'add', indexByValue: drawingId, events: [] }
            );

            this._updateList();
        }
    }

    _editDrawingOnList(rawItem) {

        const {object} = rawItem;

        const drawingId = object.options.uuid;

        const app = this.getApplication();
        const store = app.getStore();

        let currentDrawing = store.getData('drawings', drawingId);

        if(currentDrawing){
            
            const geoJSON = object.toGeoJSON();

            let { geometry } = geoJSON;
            let { coordinates } = geometry;

            if (typeof coordinates !== 'undefined') {

                currentDrawing.drawing = object;
                currentDrawing.geoJSON = geoJSON;
                currentDrawing.area = getDrawingObjectArea(geoJSON);

                store.setChangeableData(
                    'drawings', currentDrawing,
                    { mode: 'row', operation: 'update', indexByValue: drawingId, events: [] }
                );
            }
            else {

                if (currentDrawing.drawing) {
                    currentDrawing.drawing.remove();
                    currentDrawing.drawing = null;

                    store.setChangeableData(
                        'drawings', currentDrawing,
                        { mode: 'row', operation: 'delete', indexByValue: drawingId, events: [] }
                    );
                }
            }
        }

        this._updateList();
    }

    _zoomToObjectOnMap(e) {

        const app = this.getApplication();
        const appEvents = app.getAppEvents();

        appEvents.trigger('drawingObjects:zoomToObjectOnMap', e);
    }

    _editDrawing(e) {

        const application = this.getApplication();
        const mapAndUiGateway = application.getGateway();

        mapAndUiGateway.editDrawingOnListAndMap(e);
    }

    _deleteDrawings(e, mode) {

        const application = this.getApplication();
        const mapAndUiGateway = application.getGateway();

        mapAndUiGateway.deleteDrawingsOnMapAndUi(e, mode);
    }

    _toggleDrawings(e, mode) {
        
        const application = this.getApplication();
        const mapAndUiGateway = application.getGateway();

        mapAndUiGateway.toggleDrawingsOnMapAndUi(e, mode);
    }

    _updateList() {

        const app = this.getApplication();
        const store = app.getStore();

        const drawingObjectsItems = store.getData('drawings');
        const arr = Object.keys(drawingObjectsItems).map(id => drawingObjectsItems[id]);
        this.getView().widget.items = arr;

        this._resizeWidget();
    }

    _resizeWidget() {

        const app = this.getApplication();

        const { height } =  app.getMapContainer().getBoundingClientRect();
        this.getView().widget.resize(height - 150);
    }

}