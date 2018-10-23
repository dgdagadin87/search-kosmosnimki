import BaseLayerManager from '../../../base/BaseLayerManager';


export default class DrawingsLayerManager extends BaseLayerManager {

    constructor(props) {

        super(props);

        this._bindEvents();

        window.console.log('Drawings layer manager was initialized');
    }

    _bindEvents() {

        const {gmxDrawing} = this._map;
        const app = this.getApplication();
        const appEvents = app.getAppEvents();

        gmxDrawing.on('drawstop', this._addDrawingOnList.bind(this));
        gmxDrawing.on('editstop', this._editDrawingOnList.bind(this));
        gmxDrawing.on('dragend', this._editDrawingOnList.bind(this));

        appEvents.on('drawingObjects:zoomToObjectOnMap', this._zoomToObjectOnMap.bind(this));
        appEvents.on('drawingObjects:showDrawingOnMap', this._showDrawingOnMap.bind(this));
    }

    _showDrawingOnMap(drawingId, visible) {

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
            drawing.bringToBack();
            drawing.visible = true;
        }
        else {
            if(object.drawing) {
                let drawing = object.drawing;
                drawing.remove();
                object.drawing = null;
            }
        }

        store.setChangeableData(
            'drawings', object,
            { mode: 'row', operation: 'update', indexByValue: drawingId, events: [] }
        );
    }

    _zoomToObjectOnMap(e) {

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

    _addDrawingOnList(rawItem) {

        const app = this.getApplication();
        const appEvents = app.getAppEvents();

        appEvents.trigger('drawingObjects:addDrawingOnList', rawItem);
    }

    _editDrawingOnList(rawItem) {

        const app = this.getApplication();
        const appEvents = app.getAppEvents();

        appEvents.trigger('drawingObjects:editDrawingOnList', rawItem);
    }

}