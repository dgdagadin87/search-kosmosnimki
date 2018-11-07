import BaseCompositedComponent from '../../base/BaseCompositedComponent';

import { isMobile } from '../../utils/commonUtils';

import DrawingsControlComponent from './components/drawingsControl/DrawingsControlComponent';
import MapTypeSwitcherComponent from './components/mapTypeSwitcher/MapTypeSwitcherComponent';
import ZoomComponent from './components/zoom/ZoomComponent';
import BoxZoomComponent from './components/boxZoom/BoxZoomComponent';
import DownloadComponent from './components/download/DownloadComponent';


export default class MapControlsComponent extends BaseCompositedComponent {

    init() {

        this._mapControlsPrepare();

        const preparedConfig = {...this.getConfig(), parent: this};

        this._drawingsControlComponent = new DrawingsControlComponent(preparedConfig);
        this._mapTypeSwitcherComponent = new MapTypeSwitcherComponent(preparedConfig);
        this._zoomButtonComponent = new ZoomComponent(preparedConfig);
        this._downloadComponent = new DownloadComponent(preparedConfig);

        this._boxZoomComponent = isMobile() ? false : new BoxZoomComponent(preparedConfig);

        this._drawingsControlComponent.init();
        this._mapTypeSwitcherComponent.init();
        this._zoomButtonComponent.init();
        this._downloadComponent.init();

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