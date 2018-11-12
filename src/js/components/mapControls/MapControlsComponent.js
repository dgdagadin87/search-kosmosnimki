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

        let components = [];

        components.push({
            index: 'drawingsControl',
            constructor: DrawingsControlComponent
        });

        components.push({
            index: 'mapTypeSwitcher',
            constructor: MapTypeSwitcherComponent
        });

        components.push({
            index: 'zoomButton',
            constructor: ZoomComponent
        });

        components.push({
            index: 'download',
            constructor: DownloadComponent
        });

        if (!isMobile()) {

            components.push({
                index: 'boxZoom',
                constructor: BoxZoomComponent
            });
        }

        this.initChildren(components);
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