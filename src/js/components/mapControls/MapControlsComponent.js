import BaseComponent from '../../base/BaseComponent';

import BaseLayersComponent from './components/baseLayers/BaseLayersComponent';
import ZoomComponent from './components/zoom/ZoomComponent';
import BoxZoomComponent from './components/boxZoom/BoxZoomComponent';


export default class MapControlsComponent extends BaseComponent {


    constructor(props) {
        super(props);

        this._mapControlsPrepare();

        this._baseLayersComponent = new BaseLayersComponent(props);
        this._zoomComponent = new ZoomComponent(props);
        this._boxZoomComponent = new BoxZoomComponent(props);
    }

    init() {

        this._baseLayersComponent.init();
        this._zoomComponent.init();
        this._boxZoomComponent.init();
    }

    _mapControlsPrepare() {

        const map = this.getMap();

        map._controlCorners.searchControls = document.querySelector('#search-controls');                
        map._controlCorners.drawControls = document.querySelector('#draw-controls');    
        map.gmxControlsManager.init({
            gmxHide: null,
            gmxLogo: null,
            gmxZoom: null,
            gmxDrawing: null,
            svgSprite: false,
        });
    }

    getBaseLayersComponent() {

        return this._baseLayersComponent ;
    }

}