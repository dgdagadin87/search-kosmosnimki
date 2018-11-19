import BaseCompositedComponent from '../../base/BaseCompositedComponent';

import { isMobile } from '../../utils/commonUtils';

import PointComponent from './components/point/PointComponent';
import PolylineComponent from './components/polyline/PolylineComponent';
import PolygonComponent from './components/polygon/PolygonComponent';
import RectangleComponent from './components/rectangle/RectangleComponent';
import MapTypeSwitcherComponent from './components/mapTypeSwitcher/MapTypeSwitcherComponent';
import ZoomComponent from './components/zoom/ZoomComponent';
import BoxZoomComponent from './components/boxZoom/BoxZoomComponent';
import UploadComponent from './components/upload/UploadComponent';
import DownloadComponent from './components/download/DownloadComponent';


export default class MapControlsComponent extends BaseCompositedComponent {

    init() {

        const isMobileGadget = isMobile();

        let components = [];

        components.push({
            index: 'point',
            constructor: PointComponent
        });

        if (!isMobileGadget) {

            components.push({
                index: 'polyline',
                constructor: PolylineComponent
            });

            components.push({
                index: 'polygon',
                constructor: PolygonComponent
            });

            components.push({
                index: 'rectangle',
                constructor: RectangleComponent
            });
        }

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

        if (!isMobileGadget) {
            components.push({
                index: 'boxZoom',
                constructor: BoxZoomComponent
            });
        }

        this.initChildren(components);
    }

}