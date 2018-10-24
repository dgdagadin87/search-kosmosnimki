import {
    isGeojsonFeature,
    getDrawingObject,
    normalizeGeometry
} from '../utils/layersUtils';

import {NON_EDIT_LINE_STYLE} from '../config/constants/constants';


export default class GatewayBetweenMapAndInterface {

    constructor(config) {

        const {application, map} = config;

        this._application = application;
        this._map = map;
    }

    addDrawingObjectOnMapAndUi(item) {

        const application = this.getApplication();
        const store = application.getStore();
        const appEvents = application.getAppEvents();

        const { name, color, geoJSON, visible } = item;

        if(isGeojsonFeature(geoJSON)) {

            const drawingId = L.gmxUtil.newId();
            const editable = typeof geoJSON.properties.editable === 'undefined' ? true : geoJSON.properties.editable;

            const currentDrawing = getDrawingObject({ id: drawingId, name, geoJSON, color, visible, editable });

            // add drawing on list
            store.setChangeableData(
                'drawings', currentDrawing,
                { mode: 'row', operation: 'add', indexByValue: drawingId, events: ['drawings:row:add:ui'] }
            );

            // add drawing on map
            appEvents.trigger('drawingObjects:showDrawingOnMap', drawingId, visible);
        }
        else {
            return null;
        }
    }

    addDrawingObjectOnListAndMapFromOsm(results = []) {

        const map = this.getMap();

        const application = this.getApplication();
        const appEvents = application.getAppEvents();

        const features = results.map(x => {
            x.feature.properties.editable = false;
            x.feature.properties.name = x.feature.properties.ObjName;
            return x.feature;
        });

        const {fill, weight, opacity} = NON_EDIT_LINE_STYLE;

        if (features && features.length) {

            features.map(geoJSON => {

                // create map drawing object
                normalizeGeometry(geoJSON.geometry);

                let [object] = map.gmxDrawing.addGeoJSON(
                    geoJSON,
                    {
                        editable: false,
                        lineStyle: { fill, weight, opacity },
                        className: 'osm-layer'
                    }
                );

                // show drawing on map
                object.bringToBack();

                // adding drawing object on list
                appEvents.trigger('drawingObjects:addDrawingOnList', {object, geoJSON});
            });

            // zooming ??? !!!
            const json = features.reduce((a, geojson) => {
                a.addData(geojson.geometry);
                return a;
            }, L.geoJson());

            const bounds = json.getBounds();

            map.fitBounds(bounds);
        }
    }

    editDrawingOnMapAndUi(e) {

        const application = this.getApplication();
        const store = application.getStore();

        const { id: drawingId, name: drawingName, color: drawingColor } = e.detail;

        let currentDrawing = store.getData('drawings', drawingId);

        // editing drawing object on map
        let { drawing } = currentDrawing;

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

        // editing drawing object on list
        currentDrawing['name'] = drawingName;
        currentDrawing['color'] = drawingColor;
        currentDrawing['drawing'] = drawing;

        // setting drawing object in store
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