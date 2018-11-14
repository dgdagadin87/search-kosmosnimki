import BaseCompositedComponent from '../../base/BaseCompositedComponent';

import { isMobile } from '../../utils/commonUtils';

import DrawingsControlComponent from './components/drawingsControl/DrawingsControlComponent';
import MapTypeSwitcherComponent from './components/mapTypeSwitcher/MapTypeSwitcherComponent';
import ZoomComponent from './components/zoom/ZoomComponent';
import BoxZoomComponent from './components/boxZoom/BoxZoomComponent';
import UploadComponent from './components/upload/UploadComponent';
import DownloadComponent from './components/download/DownloadComponent';


export default class MapControlsComponent extends BaseCompositedComponent {

    init() {

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
            index: 'upload',
            constructor: UploadComponent
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

}