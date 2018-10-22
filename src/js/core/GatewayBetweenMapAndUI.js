export default class GatewayBetweenMapAndInterface {

    constructor(config) {

        const {application, map} = config;

        this._application = application;
        this._map = map;
    }

    editDrawingOnListAndMap(e) {

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

        store.setChangeableData(
            'drawings', currentDrawing,
            { mode: 'row', operation: 'update', indexByValue: drawingId, events: ['drawings:row:update:ui'] }
        );
    }

    deleteDrawingsOnMapAndUi(e, mode) {

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
    
                store.setChangeableData(
                    'drawings', currentDrawn,
                    { mode: 'row', operation: 'delete', indexByValue: drawingId, events: ['drawings:row:delete:ui'] }
                );
            });
    }

    toggleDrawingsOnMapAndUi(e, mode) {

        const map = this.getMap();

        const app = this.getApplication();
        const appEvents = app.getAppEvents();
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

                if (currentDrawing.drawing) {
                    drawing.bringToBack();
                    drawing.visible = true;
                }
            }
            else {
                currentDrawing.visible = false;

                if(currentDrawing.drawing) {
                    currentDrawing.drawing.remove();
                    currentDrawing.drawing = null;
                }
            }

            store.setChangeableData(
                'drawings', currentDrawing,
                { mode: 'row', operation: 'update', indexByValue: drawingId, events: [] }
            );
        })

        appEvents.trigger('drawingObjects:updateList');
    }

    getApplication() {

        return this._application;
    }

    getMap() {

        return this._map;
    }

}