import BaseLayerManager from '../../base/BaseLayerManager';

import { getDrawingObject, getDrawingObjectArea } from '../../utils/layersUtils';


export default class DrawingsLayerManager extends BaseLayerManager {

    constructor(props) {

        super(props);

        this._bindEvents();

        window.console.log('Drawings layer manager was initialized');
    }

    _bindEvents() {

        const {gmxDrawing} = this._map;

        const store = this.getStore();

        gmxDrawing.on('drawstop', this._addDrawingOnList.bind(this));
        gmxDrawing.on('editstop', this._editDrawingOnList.bind(this));
        gmxDrawing.on('dragend', this._editDrawingOnList.bind(this));

        store.on('drawings:row:update:mapToggleDrawing', this._toggleDrawingOnMap.bind(this));
    }

    _toggleDrawingOnMap({ rowId }) {

        if (rowId) {

            const store = this.getStore();

            const currentDrawing = store.getData('drawings', rowId);
            const { visible, drawing } = currentDrawing;

            if (visible) {
                if (drawing) {
                    drawing.bringToBack();
                    drawing.visible = true;
                }
            }
            else {
                if(currentDrawing.drawing) {
                    currentDrawing.drawing.remove();
                    currentDrawing.drawing = null;
                }
            }
        }
    }

    _addDrawingOnList(rawItem) {

        const {object, geoJSON} = rawItem;

        const drawingId = object.options.uuid || L.gmxUtil.newId();

        const store = this.getStore();

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

            /* event name: <drawings:row:add:ui> */
            store.setChangeableData(
                'drawings', drawingObject,
                { mode: 'row', operation: 'add', indexByValue: drawingId, events: ['ui'] }
            );
        }
    }

    _editDrawingOnList(rawItem) {

        const {object} = rawItem;

        const drawingId = object.options.uuid;

        const store = this.getStore();

        let currentDrawing = store.getData('drawings', drawingId);

        if(currentDrawing){
            
            const geoJSON = object.toGeoJSON();

            let { geometry } = geoJSON;
            let { coordinates } = geometry;

            if (typeof coordinates !== 'undefined') {

                currentDrawing.drawing = object;
                currentDrawing.geoJSON = geoJSON;
                currentDrawing.area = getDrawingObjectArea(geoJSON);

                /* event name: <drawings:row:update:ui> */
                store.setChangeableData(
                    'drawings', currentDrawing,
                    { mode: 'row', operation: 'update', indexByValue: drawingId, events: ['ui'] }
                );
            }
            else {

                if (currentDrawing.drawing) {
                    currentDrawing.drawing.remove();
                    currentDrawing.drawing = null;

                    /* event name: <drawings:row:delete:ui> */
                    store.setChangeableData(
                        'drawings', currentDrawing,
                        { mode: 'row', operation: 'delete', indexByValue: drawingId, events: ['ui'] }
                    );
                }
            }
        }
    }

}