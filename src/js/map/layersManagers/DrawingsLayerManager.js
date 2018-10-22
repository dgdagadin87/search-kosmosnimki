import BaseLayerManager from '../../base/BaseLayerManager';


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