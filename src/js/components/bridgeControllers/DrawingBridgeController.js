import BaseBridgeController from 'js/base/BaseBridgeController';

import {
    isGeojsonFeature,
    getDrawingObject,
    normalizeGeometry,
    getDrawingObjectArea
} from 'js/utils/CommonUtils';

import {NON_EDIT_LINE_STYLE} from 'js/config/constants/Constants';


export default class DrawingBridgeController extends BaseBridgeController {

    /* Add drawing start */
    addDrawingOnList(rawItem) {
        
        const application = this.getApplication();
        const store = application.getStore();
        const {object, geoJSON} = rawItem;
        const drawingId = object.options.uuid || L.gmxUtil.newId();
        const drawing = store.getData('drawings', drawingId);

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

            store.addData('drawings', {id: drawingId, content: drawingObject}, ['drawings:updateList']);
        }
    }

    addDrawingOnMapAndList(item, returnId = false) {

        const application = this.getApplication();
        const store = application.getStore();

        const { name, color, geoJSON, visible } = item;

        if(isGeojsonFeature(geoJSON)) {

            const drawingId = L.gmxUtil.newId();
            const editable = typeof geoJSON.properties.editable === 'undefined' ? true : geoJSON.properties.editable;

            const currentDrawing = getDrawingObject({ id: drawingId, name, geoJSON, color, visible, editable });

            // add drawing on list
            store.addData('drawings', {id: drawingId, content: currentDrawing}, ['drawings:updateList']);

            // add drawing on map
            this.toggleDrawingOnMap(drawingId, visible);

            if (returnId) {
                return drawingId;
            }
        }
        else {
            return null;
        }
    }

    addDrawingsOnListAndMapFromUploading(items = []) {

        const application = this.getApplication();
        const store = application.getStore();
        const map = this.getMap();

        let idsList = [];

        items.forEach(item => {
            const {name, selectedName, color, editable, visible, geoJSON: {geometry, properties}} = item;
            const itemId = this.addDrawingOnMapAndList({
                name: selectedName ? selectedName : name,
                color,
                geoJSON: {type: 'Feature', properties, geometry},
                visible,
                editable,
            }, true);
            idsList.push(itemId);
        });

        const drawings = store.getData('drawings');
        const addedDrawings = idsList.map(itemId => drawings[itemId]);

        let bounds = null;

        addedDrawings.forEach(item => {
            const {drawing} = item;
            if (drawing) {
                if (bounds) {
                    bounds.extend(drawing.getBounds());
                }
                else {
                    bounds = drawing.getBounds();
                }                                            
            }
        });

        bounds && map.fitBounds(bounds, { animate: false });
    }

    addDrawingOnMapAndListFromOsm(results = []) {

        const map = this.getMap();

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
                //object.bringToBack();
                object.bringToFront();

                // adding drawing object on list
                this.addDrawingOnList({object, geoJSON});
            });

            // zooming ??? !!!
            const json = features.reduce((a, geojson) => {
                a.addData(geojson.geometry);
                return a;
            }, L.geoJson());

            const bounds = json.getBounds();

            bounds && map.fitBounds(bounds);
        }
    }
    /* Add drawing end */

    /* Edit drawing start */
    editDrawingOnList(rawItem) {

        const application = this.getApplication();
        const store = application.getStore();
        const {object} = rawItem;
        const drawingId = object.options.uuid;

        let currentDrawing = store.getData('drawings', drawingId);

        if(currentDrawing){
            
            const geoJSON = object.toGeoJSON();

            let { geometry } = geoJSON;
            let { coordinates } = geometry;

            if (typeof coordinates !== 'undefined') {

                currentDrawing.drawing = object;
                currentDrawing.geoJSON = geoJSON;
                currentDrawing.area = getDrawingObjectArea(geoJSON);

                store.updateData('drawings', {id: drawingId, content: currentDrawing}, ['drawings:redrawItem']);
            }
            else {

                if (currentDrawing.drawing) {
                    currentDrawing.drawing.remove();
                    currentDrawing.drawing = null;

                    store.removeData('drawings', drawingId, ['drawings:updateList']);
                }
            }
        }
    }

    editDrawingOnMapAndList(e) {

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
        store.updateData('drawings', {id: drawingId, content: currentDrawing}, ['drawings:redrawItem']);
    }
    /* Edit drawing end */

    /* Toggle drawing start */
    toggleDrawingOnMap(drawingId, visible) {

        const application = this.getApplication();
        const store = application.getStore();

        let object = store.getData('drawings', drawingId);

        if (visible) {
            let color = object.color;
            let editable = typeof object.geoJSON.properties.editable === 'undefined' ? true : object.geoJSON.properties.editable;
            let options = {
                editable,
                lineStyle: {
                    fill: false,
                    weight: 2,
                    opacity: 1,
                    color,
                },
                pointStyle: {
                    color,
                }
            };
            let [drawing] = this._map.gmxDrawing.addGeoJSON(object.geoJSON, options);
            if (!editable) {
                options.className = 'osm-layer';
                // drawing.enableEdit();
                drawing.setOptions({
                    editable,
                    lineStyle: {
                        fill: false,
                        weight: 2,
                        opacity: 1,
                        color,
                    },
                    pointStyle: {color}
                });
                // drawing.disableEdit();
            }
            drawing.options.uuid = drawingId;
            object.drawing = drawing;
            //drawing.bringToBack();
            drawing.bringToFront();
            drawing.visible = true;
        }
        else {
            if(object.drawing) {
                let drawing = object.drawing;
                drawing.remove();
                object.drawing = null;
            }
        }

        store.updateData('drawings', {id:drawingId, content:object});
    }

    toggleDrawingsOnMapAndList(e, mode) {

        const map = this.getMap();
        const application = this.getApplication();
        const store = application.getStore();
        const commonVisible = mode === 'all' ? e.detail : e.detail.visible;

        const drawnObjects = this._getDrawingObjects(store, mode, e);

        let contentForStore = [];

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
                    //drawing.bringToBack();
                    drawing.bringToFront();
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

            contentForStore.push({id:drawingId, content: currentDrawing});
        })

        store.updateData('drawings', contentForStore, ['drawings:updateList']);
    }
    /* Toggle drawing end */

    /* Delete drawing start */
    deleteDrawingsOnMapAndList(e, mode) {

            const deleteDrawingFromMap = drawing => {
                if (drawing) {
                    drawing.remove();
                } 
            };
            const application = this.getApplication();
            const store = application.getStore();
    
            const drawnObjects = this._getDrawingObjects(store, mode, e);
    
            drawnObjects.forEach(currentDrawn => {
                let { drawing: drawingObject } = currentDrawn;
                deleteDrawingFromMap(drawingObject);
            });

            if (mode === 'row') {
                store.removeData('drawings', [e.detail['id']], ['drawings:updateList']);
            }
            else {
                store.clear('drawings', ['drawings:updateList']);
            }
    }
    /* Delete drawing end */

    /* Zoom to drawing start */
    zoomToDrawingOnMap(e) {

        const map = this._map;
        const application = this.getApplication();
        const store = application.getStore();

        const {id, visible} = e.detail;

        let item = store.getData('drawings', id);

        if (visible && item) {
            let {type, coordinates} = item.geoJSON.geometry;
            if (type === 'Point') {
                let center = L.latLng(coordinates[1],coordinates[0]);
                map.setView(center);
            }
            else {
                const bounds = item.drawing.getBounds();
                map.fitBounds(bounds, { animate: false });
            }
        }
    }
    /* Zoom to drawing end */

    _getDrawingObjects(store, mode, e = {}) {

        let drawnObjects;
    
        if (mode === 'row') {
            const { id: drawingId } = e.detail;
            drawnObjects = [store.getData('drawings', drawingId)];
        }
        else {
            const rawDrawnObjects = store.getData('drawings');
            drawnObjects = Object.keys(rawDrawnObjects).map(id => rawDrawnObjects[id]);
        }

        return drawnObjects;
    }

}