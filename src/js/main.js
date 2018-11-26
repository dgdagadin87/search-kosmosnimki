import "@babel/polyfill";
import 'nodelist-foreach-polyfill';

import './services/css/css';
import './services/translations/translations';

import Application from './application/Application';

import DrawingBridgeController from './components/bridgeControllers/DrawingBridgeController';
import ContourBridgeController from './components/bridgeControllers/ContourBridgeController';

import DrawingLayerManager from './components/layersManagers/DrawingsLayerManager';
import ContourLayerManager from './components/layersManagers/ContoursLayerManager';

import ShapeLoaderAddon from './components/addons/shapeLoader/ShapeLoaderAddon';

import LoaderIndicatorUiElement from './components/interfaceElements/customUnits/loaderIndicator/LoaderIndicatorUiElement';
import PopupNotificationUiElement from './components/interfaceElements/customUnits/popupNotification/PopupNotificationUiElement';
import ErrorDialogUiElement from './components/interfaceElements/customUnits/errorDialog/ErrorDialogUiElement';
import HelpingButtonUiElement from './components/interfaceElements/customUnits/helpingButton/HelpingButtonUiElement';
import UserInformationUiElement from './components/interfaceElements/customUnits/userInformation/UserInformationUiElement';
import LanguageSelectUiElement from './components/interfaceElements/customUnits/languageSelect/LanguageSelectUiElement';
import MakeOrderUiElement from './components/interfaceElements/customUnits/makeOrder/MakeOrderUiElement';

import PointUiElement from './components/interfaceElements/gmxIcons/point/PointUiElement';
import PolylineUiElement from './components/interfaceElements/gmxIcons/polyline/PolylineUiElement';
import PolygonUiElement from './components/interfaceElements/gmxIcons/polygon/PolygonUiElement';
import RectangleUiElement from './components/interfaceElements/gmxIcons/rectangle/RectangleUiElement';
import BoxZoomUiElement from './components/interfaceElements/gmxIcons/boxZoom/BoxZoomUiElement';
import UploadUiElement from './components/interfaceElements/gmxIcons/upload/UploadUiElement';
import DownloadUiElement from './components/interfaceElements/gmxIcons/download/DownloadUiElement';

import BaseLayersUiElement from './components/interfaceElements/mapWidgets/baseLayers/BaseLayersUiElement';
import ZoomUiElement from './components/interfaceElements/mapWidgets/zoom/ZoomUiElement';
import SidebarUiElement from './components/interfaceElements/mapWidgets/sidebar/SidebarUiElement';
import DrawingObjectsUiElement from './components/interfaceElements/mapWidgets/drawingObjects/DrawingObjectsUiElement';


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
    uiElements: [
        {
            type: 'customUnit',
            index: 'loaderIndicator',
            constructor: LoaderIndicatorUiElement
        },
        {
            type: 'custom',
            index: 'popupNotificator',
            constructor: PopupNotificationUiElement
        },
        {
            type: 'customUnit',
            index: 'errorDialog',
            constructor: ErrorDialogUiElement
        },
        {
            type: 'customUnit',
            index: 'helpingButton',
            constructor: HelpingButtonUiElement
        },
        {
            type: 'customUnit',
            index: 'userInformation',
            constructor: UserInformationUiElement
        },
        {
            type: 'customUnit',
            index: 'languageSelect',
            constructor: LanguageSelectUiElement
        },
        {
            type: 'customUnit',
            index: 'makeOrder',
            constructor: MakeOrderUiElement
        },
        {
            type: 'gmxIcon',
            index: 'point',
            constructor: PointUiElement
        },
        {
            type: 'gmxIcon',
            index: 'polyline',
            constructor: PolylineUiElement,
            mobile: false
        },
        {
            type: 'gmxIcon',
            index: 'polygon',
            constructor: PolygonUiElement,
            mobile: false
        },
        {
            type: 'gmxIcon',
            index: 'rectangle',
            constructor: RectangleUiElement,
            mobile: false
        },
        {
            type: 'gmxIcon',
            index: 'upload',
            constructor: UploadUiElement
        },
        {
            type: 'gmxIcon',
            index: 'download',
            constructor: DownloadUiElement
        },
        {
            type: 'gmxIcon',
            index: 'boxZoom',
            constructor: BoxZoomUiElement,
            mobile: false
        },
        {
            type: 'mapWidget',
            index: 'baseLayers',
            constructor: BaseLayersUiElement
        },
        {
            type: 'mapWidget',
            index: 'zoom',
            constructor: ZoomUiElement
        },
        {
            type: 'mapWidget',
            index: 'drawingObjects',
            constructor: DrawingObjectsUiElement
        },
        {
            type: 'mapWidget',
            index: 'sidebar',
            constructor: SidebarUiElement
        }
    ]

});

application.start();