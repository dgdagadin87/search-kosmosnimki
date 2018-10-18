import BaseLayerManager from '../../base/BaseLayerManager';

import { getDrawingObject } from '../../utils/layersUtils';


export default class DrawingsLayerManager extends BaseLayerManager {

    constructor(props) {

        super(props);

        this._bindEvents();

        window.console.log('Drawings layer manager was initialized');
    }

    _bindEvents() {

        const {gmxDrawing} = this._map;

        gmxDrawing.on('drawstop', this._addDrawingOnList.bind(this));

        gmxDrawing.on('editstop', this._editDrawingOnList.bind(this));

        gmxDrawing.on('dragend', this._onDragEndHandler.bind(this));
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

            /* event name: <drawings:row:add:ui> */
            store.setChangeableData(
                'drawings',
                drawingObject,
                {
                    mode: 'row',
                    operation: 'add',
                    indexByValue: drawingId,
                    events: ['ui']
                }
            );
        }
    }

    _editDrawingOnList(rawItem) {

        const {object} = rawItem;

        const drawingId = object.options.uuid;

        const store = this.getStore();

        const drawing = store.getChangeableData('drawings', {
            mode: 'row',
            rowId: drawingId
        });

        if(drawing){
            console.log('drawing exists');
            console.log(drawing);
        }
    }

    _onDragEndHandler() {

        //console.log(arguments);
    }

}