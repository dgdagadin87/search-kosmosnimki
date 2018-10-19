import BaseComponent from '../../base/BaseComponent';

import { DrawnObjectsControl } from './components/DrawnObjects';


export default class DrawingObjectsComponent extends BaseComponent {

    constructor(props) {

        super(props);

        this._component = new DrawnObjectsControl({position: 'topright'});
    }

    init() {

        const map = this.getMap();

        map.addControl(this._component);

        this._bindEvents(); // TODO - incorrect
    }

    _bindEvents() {

        const app = this.getApplication();
        const store = app.getStore();

        const componentWidget = this._component.widget;
        
        store.on('drawings:row:add:ui', this._updateList.bind(this));
        store.on('drawings:row:update:ui', this._updateList.bind(this));
        store.on('drawings:row:delete:ui', this._updateList.bind(this));

        store.on('drawings:row:update:uiUpdateList', this._updateList.bind(this));

        componentWidget.addEventListener('editDrawing', (e) => this._editDrawing(e));
        componentWidget.addEventListener('zoomToObject', (e) => this._zoomToObjectOnMap(e));

        componentWidget.addEventListener('toggleDrawing', (e, mode = 'row') => this._toggleDrawings(e, mode));
        componentWidget.addEventListener('toggleAllDrawings', (e, mode = 'all') => this._toggleDrawings(e, mode));
        componentWidget.addEventListener('deleteDrawing', (e, mode = 'row') => this._deleteDrawings(e, mode));
        componentWidget.addEventListener('deleteAllDrawings', (e, mode = 'all') => this._deleteDrawings(e, mode));
    }

    _zoomToObjectOnMap(e) {

        const map = this.getMap();
        const store = this.getApplication().getStore();

        const {id, visible} = e.detail;

        let item = store.getData('drawings', id);

        if (visible && item) {
            let {type, coordinates} = item.geoJSON.geometry;
            if (type === 'Point') {
                let center = L.latLng(coordinates[1],coordinates[0]);
                map.setView(center);
                // this._map.invalidateSize();
            }
            else {
                const bounds = item.drawing.getBounds();
                map.fitBounds(bounds, { animate: false });
                // this._map.invalidateSize();
            }
        }
    }

    _editDrawing(e) {

        const store = this.getApplication().getStore();

        const { id: drawingId, name: drawingName, color: drawingColor } = e.detail;

        let currentDrawing = store.getData('drawings', drawingId);
        let { drawing } = currentDrawing;

        currentDrawing['name'] = drawingName;
        currentDrawing['color'] = drawingColor;

        let options = {
            lineStyle: {
                fill: false,
                weight: 2,
                opacity: 1,
                color: drawingColor,
            },
            pointStyle: {color: drawingColor}
        };
        if (drawing) {
            if (drawing.options.editable) {
                drawing.setOptions(options);
            }
            else {
                drawing.enableEdit();
                options.className = 'osm-layer';
                drawing.setOptions(options);
                drawing.disableEdit();
            }
        }

        currentDrawing['drawing'] = drawing;

        /* event name: <drawings:row:update:ui> */
        store.setChangeableData(
            'drawings', currentDrawing,
            { mode: 'row', operation: 'update', indexByValue: drawingId, events: ['ui'] }
        );
    }

    _deleteDrawings(e, mode) {

        const deleteDrawingFromMap = drawing => {

            if (drawing) {
                drawing.remove();
            } 
        }

        const app = this.getApplication();
        const store = app.getStore();

        let drawnObjects;

        if (mode === 'row') {

            const { id: drawingId } = e.detail;

            drawnObjects = [store.getData('drawings', drawingId)];
        }
        else {

            const rawDrawnObjects = store.getData('drawings');
            drawnObjects = Object.keys(rawDrawnObjects).map(id => rawDrawnObjects[id]);
        }

        drawnObjects.forEach(currentDrawn => {

            let { drawing: drawingObject, id: drawingId } = currentDrawn;

            deleteDrawingFromMap(drawingObject);

            /* event name: no event */
            store.setChangeableData(
                'drawings', currentDrawn,
                { mode: 'row', operation: 'delete', indexByValue: drawingId, events: [] }
            );
        });

        this._updateList();
    }

    _toggleDrawings(e, mode) {
        
        const map = this.getMap();

        const app = this.getApplication();
        const store = app.getStore();

        const commonVisible = mode === 'all' ? e.detail : e.detail.visible;

        let drawnObjects;

        if (mode === 'row') {

            const { id: drawingId } = e.detail;
            drawnObjects = [store.getData('drawings', drawingId)];
        }
        else {

            const rawDrawnObjects = store.getData('drawings');
            drawnObjects = Object.keys(rawDrawnObjects).map(id => rawDrawnObjects[id]);
        }

        drawnObjects.forEach(currentDrawing => {

            const { id: drawingId } = currentDrawing;

            if (commonVisible) {

                // getting drawing from currentDrawing
                let drawingOptions = {};

                drawingOptions['color'] = currentDrawing.color;
                drawingOptions['editable'] = typeof currentDrawing.geoJSON.properties.editable === 'undefined' ? true : currentDrawing.geoJSON.properties.editable;
                drawingOptions['lineStyle'] = { fill: false, weight: 2, opacity: 1, color: currentDrawing.color };
                drawingOptions['pointStyle'] = { color: currentDrawing.color };
    
                let [drawing] = map.gmxDrawing.addGeoJSON(currentDrawing.geoJSON, drawingOptions);
    
                if (!drawingOptions['editable']) {
    
                    drawingOptions['className'] = 'osm-layer';
                    drawing.setOptions(drawingOptions);
                }
    
                drawing.options.uuid = drawingId;
                currentDrawing.drawing = drawing;

                currentDrawing.visible = true;
            }
            else {
                currentDrawing.visible = false;
            }

            /* event name: <drawings:row:update:mapToggleDrawing> */
            store.setChangeableData(
                'drawings', currentDrawing,
                { mode: 'row', operation: 'update', indexByValue: drawingId, events: ['mapToggleDrawing'] }
            );
        })

        this._updateList();
    }

    _updateList() {

        const app = this.getApplication();
        const store = app.getStore();

        const drawingObjectsItems = store.getData('drawings');
        const arr = Object.keys(drawingObjectsItems).map(id => drawingObjectsItems[id]);
        this._component.widget.items = arr;

        this._resizeWidget();
    }

    _resizeWidget() {

        const app = this.getApplication();

        const { height } =  app.getMapContainer().getBoundingClientRect();
        this._component.widget.resize(height - 150);
    }

}