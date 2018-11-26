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

import LoaderIndicatorUiElement from './components/uiElements/customElements/loaderIndicator/LoaderIndicatorUiElement';
import PopupNotificationUiElement from './components/uiElements/customElements/popupNotification/PopupNotificationUiElement';
import ErrorDialogUiElement from './components/uiElements/customElements/errorDialog/ErrorDialogUiElement';
import HelpingButtonUiElement from './components/uiElements/customElements/helpingButton/HelpingButtonUiElement';
import UserInformationUiElement from './components/uiElements/customElements/userInformation/UserInformationUiElement';
import LanguageSelectUiElement from './components/uiElements/customElements/languageSelect/LanguageSelectUiElement';
import MakeOrderUiElement from './components/uiElements/customElements/makeOrder/MakeOrderUiElement';

import PointUiElement from './components/uiElements/iconElements/point/PointUiElement';
import PolylineUiElement from './components/uiElements/iconElements/polyline/PolylineUiElement';
import PolygonUiElement from './components/uiElements/iconElements/polygon/PolygonUiElement';
import RectangleUiElement from './components/uiElements/iconElements/rectangle/RectangleUiElement';
import BoxZoomUiElement from './components/uiElements/iconElements/boxZoom/BoxZoomUiElement';
import UploadUiElement from './components/uiElements/iconElements/upload/UploadUiElement';
import DownloadUiElement from './components/uiElements/iconElements/download/DownloadUiElement';

import BaseLayersUiElement from './components/uiElements/widgetElements/baseLayers/BaseLayersUiElement';
import ZoomUiElement from './components/uiElements/widgetElements/zoom/ZoomUiElement';
import SidebarUiElement from './components/uiElements/widgetElements/sidebar/SidebarUiElement';
import DrawingObjectsUiElement from './components/uiElements/widgetElements/drawingObjects/DrawingObjectsUiElement';


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
            type: 'custom',
            index: 'loaderIndicator',
            constructor: LoaderIndicatorUiElement
        },
        {
            type: 'custom',
            index: 'popupNotificator',
            constructor: PopupNotificationUiElement
        },
        {
            type: 'custom',
            index: 'errorDialog',
            constructor: ErrorDialogUiElement
        },
        {
            type: 'custom',
            index: 'helpingButton',
            constructor: HelpingButtonUiElement
        },
        {
            type: 'custom',
            index: 'userInformation',
            constructor: UserInformationUiElement
        },
        {
            type: 'custom',
            index: 'languageSelect',
            constructor: LanguageSelectUiElement
        },
        {
            type: 'custom',
            index: 'makeOrder',
            constructor: MakeOrderUiElement
        },
        {
            type: 'icon',
            index: 'point',
            constructor: PointUiElement
        },
        {
            type: 'icon',
            index: 'polyline',
            constructor: PolylineUiElement,
            mobile: false
        },
        {
            type: 'icon',
            index: 'polygon',
            constructor: PolygonUiElement,
            mobile: false
        },
        {
            type: 'icon',
            index: 'rectangle',
            constructor: RectangleUiElement,
            mobile: false
        },
        {
            type: 'icon',
            index: 'upload',
            constructor: UploadUiElement
        },
        {
            type: 'icon',
            index: 'download',
            constructor: DownloadUiElement
        },
        {
            type: 'icon',
            index: 'boxZoom',
            constructor: BoxZoomUiElement,
            mobile: false
        },
        {
            type: 'widget',
            index: 'baseLayers',
            constructor: BaseLayersUiElement
        },
        {
            type: 'widget',
            index: 'zoom',
            constructor: ZoomUiElement
        },
        {
            type: 'widget',
            index: 'drawingObjects',
            constructor: DrawingObjectsUiElement
        },
        {
            type: 'widget',
            index: 'sidebar',
            constructor: SidebarUiElement
        }
    ]

});

application.start();