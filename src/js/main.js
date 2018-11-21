import "@babel/polyfill";
import 'nodelist-foreach-polyfill';

import './services/css/css';
import './services/translations/translations';

import { isMobile } from './utils/commonUtils';

import Application from './application/Application';

import DrawingBridgeController from './components/bridgeControllers/DrawingBridgeController';
import ContourBridgeController from './components/bridgeControllers/ContourBridgeController';

import DrawingLayerManager from './components/layersManagers/DrawingsLayerManager';
import ContourLayerManager from './components/layersManagers/ContoursLayerManager';

import ShapeLoaderAddon from './addons/shapeLoader/ShapeLoaderAddon';

import LoaderIndicatorComponent from './components/interfaceElements/customUnits/loaderIndicator/LoaderIndicatorComponent';
import PopupNotificationComponent from './components/interfaceElements/customUnits/popupNotification/PopupNotificationComponent';
import ErrorDialogComponent from './components/interfaceElements/customUnits/errorDialog/ErrorDialogComponent';
import HelpingButtonComponent from './components/interfaceElements/customUnits/helpingButton/HelpingButtonComponent';
import UserInformationComponent from './components/interfaceElements/customUnits/userInformation/UserInformationComponent';
import LanguageSelectComponent from './components/interfaceElements/customUnits/languageSelect/LanguageSelectComponent';
import MakeOrderComponent from './components/interfaceElements/customUnits/makeOrder/MakeOrderComponent';
import AboutDialogComponent from './components/interfaceElements/customUnits/aboutDialog/AboutDialogComponent';

import PointComponent from './components/interfaceElements/gmxIcons/point/PointComponent';
import PolylineComponent from './components/interfaceElements/gmxIcons/polyline/PolylineComponent';
import PolygonComponent from './components/interfaceElements/gmxIcons/polygon/PolygonComponent';
import RectangleComponent from './components/interfaceElements/gmxIcons/rectangle/RectangleComponent';
import BoxZoomComponent from './components/interfaceElements/gmxIcons/boxZoom/BoxZoomComponent';
import UploadComponent from './components/interfaceElements/gmxIcons/upload/UploadComponent';
import DownloadComponent from './components/interfaceElements/gmxIcons/download/DownloadComponent';

import MapTypeSwitcherComponent from './components/interfaceElements/mapWidgets/mapTypeSwitcher/MapTypeSwitcherComponent';
import ZoomComponent from './components/interfaceElements/mapWidgets/zoom/ZoomComponent';
import SidebarComponent from './components/interfaceElements/mapWidgets/sidebar/SidebarComponent';
import DrawingObjectsComponent from './components/interfaceElements/mapWidgets/drawingObjects/DrawingObjectsComponent';


const isMobileGadget = isMobile();

let interfaceElements = [];

// custom elements
interfaceElements.push({
    type: 'customUnit',
    index: 'loaderIndicator',
    constructor: LoaderIndicatorComponent
});
interfaceElements.push({
    type: 'custom',
    index: 'popupNotificator',
    constructor: PopupNotificationComponent
});
interfaceElements.push({
    type: 'customUnit',
    index: 'errorDialog',
    constructor: ErrorDialogComponent
});
interfaceElements.push({
    type: 'customUnit',
    index: 'helpingButton',
    constructor: HelpingButtonComponent
});
interfaceElements.push({
    type: 'customUnit',
    index: 'userInformation',
    constructor: UserInformationComponent
});
interfaceElements.push({
    type: 'customUnit',
    index: 'languageSelect',
    constructor: LanguageSelectComponent
});
interfaceElements.push({
    type: 'customUnit',
    index: 'makeOrder',
    constructor: MakeOrderComponent
});
interfaceElements.push({
    type: 'customUnit',
    index: 'about',
    constructor: AboutDialogComponent
});

// gmx icons
interfaceElements.push({
    type: 'gmxIcon',
    index: 'point',
    constructor: PointComponent
});
if (!isMobileGadget) {
    interfaceElements.push({
        type: 'gmxIcon',
        index: 'polyline',
        constructor: PolylineComponent
    });
    interfaceElements.push({
        type: 'gmxIcon',
        index: 'polygon',
        constructor: PolygonComponent
    });
    interfaceElements.push({
        type: 'gmxIcon',
        index: 'rectangle',
        constructor: RectangleComponent
    });
}
interfaceElements.push({
    type: 'gmxIcon',
    index: 'upload',
    constructor: UploadComponent
});
interfaceElements.push({
    type: 'gmxIcon',
    index: 'download',
    constructor: DownloadComponent
});
if (!isMobileGadget) {
    interfaceElements.push({
        type: 'gmxIcon',
        index: 'boxZoom',
        constructor: BoxZoomComponent
    });
}

// mapWidgets
interfaceElements.push({
    type: 'mapWidget',
    index: 'mapTypeSwitcher',
    constructor: MapTypeSwitcherComponent
});
interfaceElements.push({
    type: 'mapWidget',
    index: 'zoom',
    constructor: ZoomComponent
});
interfaceElements.push({
    type: 'mapWidget',
    index: 'drawingObjects',
    constructor: DrawingObjectsComponent
});
interfaceElements.push({
    type: 'mapWidget',
    index: 'sidebar',
    constructor: SidebarComponent
});

const application = new Application({

    //store
    store: {
        'name': 'searchStore',
        'data': [
            {
                'key': 'userInfo',
                'isTable': false
            },
            {
                'key': 'about',
                'isTable': false
            },
            {
                'key': 'drawings',
                'isTable': true,
                'indexBy': 'id'
            },
            {
                'key': 'contours',
                'isTable': true,
                'indexBy': 'gmx_id'
            },
            {
                'key': 'downloadCache',
                'isTable': false
            },
            {
                'key': 'searchCriteria',
                'isTable': false
            },
            {
                'key': 'cancelLoading',
                'isTable': false
            },
            {
                'key': 'activeIcon',
                'isTable': false
            }
        ]
    },

    // bridge controllers
    bridgeControllers: [
        {
            'index': 'drawing',
            constructor: DrawingBridgeController
        },
        {
            'index': 'contour',
            constructor: ContourBridgeController
        }
    ],

    // layers managers
    layersManagers: [
        {
            'index': 'drawing',
            constructor: DrawingLayerManager
        },
        {
            'index': 'contour',
            constructor: ContourLayerManager
        }
    ],

    // addons
    addons: [
        {
            index: 'shapeLoader',
            constructor: ShapeLoaderAddon
        }
    ],

    // components
    components: interfaceElements

});

application.start();