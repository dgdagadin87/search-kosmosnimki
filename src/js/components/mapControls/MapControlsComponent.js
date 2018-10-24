import BaseCompositedComponent from '../../base/BaseCompositedComponent';

import { isMobile } from '../../utils/commonUtils';

import DrawingsControlComponent from './components/drawingsControl/DrawingsControlComponent';
import MapTypeSwitcherComponent from './components/mapTypeSwitcher/MapTypeSwitcherComponent';
import ZoomComponent from './components/zoom/ZoomComponent';
import BoxZoomComponent from './components/boxZoom/BoxZoomComponent';


export default class MapControlsComponent extends BaseCompositedComponent {

    init() {

        this._mapControlsPrepare();

        this._drawingsControlComponent = new DrawingsControlComponent(this.getConfig());
        this._mapTypeSwitcherComponent = new MapTypeSwitcherComponent(this.getConfig());
        this._zoomComponent = new ZoomComponent(this.getConfig());

        this._boxZoomComponent = isMobile() ? false : new BoxZoomComponent(this.getConfig());

        this._drawingsControlComponent.init();
        this._mapTypeSwitcherComponent.init();
        this._zoomComponent.init();

        !isMobile() && this._boxZoomComponent.init();
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

}