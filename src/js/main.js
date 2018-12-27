import "@babel/polyfill";
import 'nodelist-foreach-polyfill';

import './services/css/Css';
import './services/translations/Translations';

import { createDefaultCriteria, createDefaultFilter } from './utils/CommonUtils';

import Application from './application/Application';

import DrawingBridgeController from './components/bridgeControllers/DrawingBridgeController';
import ContourBridgeController from './components/bridgeControllers/ContourBridgeController';

import DrawingMapManager from './components/mapManagers/DrawingsMapManager';
import ContourMapManager from './components/mapManagers/ContoursMapManager';

import ShapeLoaderAddon from './components/addons/shapeLoader/ShapeLoaderAddon';
import AppStateManagerAddon from './components/addons/appStateManager/AppStateManagerAddon';

import LoadingIndicatorUiElement from './components/uiElements/customElements/loadingIndicator/LoadingIndicatorUiElement';
import PopupNotificationUiElement from './components/uiElements/customElements/popupNotification/PopupNotificationUiElement';
import ErrorDialogUiElement from './components/uiElements/customElements/errorDialog/ErrorDialogUiElement';
import HelpButtonUiElement from './components/uiElements/customElements/helpButton/HelpButtonUiElement';
import AuthInformationUiElement from './components/uiElements/customElements/authInformation/AuthInformationUiElement';
import LanguageSelectUiElement from './components/uiElements/customElements/languageSelect/LanguageSelectUiElement';
import OrderCreatorUiElement from './components/uiElements/customElements/orderCreator/OrderCreatorUiElement';

import PointUiElement from './components/uiElements/iconElements/point/PointUiElement';
import PolylineUiElement from './components/uiElements/iconElements/polyline/PolylineUiElement';
import PolygonUiElement from './components/uiElements/iconElements/polygon/PolygonUiElement';
import RectangleUiElement from './components/uiElements/iconElements/rectangle/RectangleUiElement';
import BoxZoomUiElement from './components/uiElements/iconElements/boxZoom/BoxZoomUiElement';
import UploadUiElement from './components/uiElements/iconElements/upload/UploadUiElement';
import DownloadUiElement from './components/uiElements/iconElements/download/DownloadUiElement';
import PermalinkUiElement from './components/uiElements/iconElements/permalink/PermalinkUIElement';

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
                'isTable': false,
                'defaultValue': createDefaultCriteria()
            },
            {
                'key': 'clientFilter',
                'isTable': false,
                'defaultValue': {
                    isChanged: false,
                    filterData: createDefaultFilter()
                }
            },
            {
                'key': 'meta',
                'isTable': false,
                'defaultValue': {
                    currentTab: null,
                    about: '',
                    cancelLoading: false,
                    updateResults: false,
                    activeIcon: null,
                    activeLayer: null
                }
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

    // map managers
    mapManagers: [
        {
            'index': 'drawing',
            constructor: DrawingMapManager
        },
        {
            'index': 'contour',
            constructor: ContourMapManager
        }
    ],

    // addons
    addons: [
        {
            index: 'shapeLoader',
            constructor: ShapeLoaderAddon
        },
        {
            index: 'appStateManager',
            constructor: AppStateManagerAddon
        }
    ],

    // components
    uiElements: [
        {
            type: 'custom',
            index: 'loadingIndicator',
            constructor: LoadingIndicatorUiElement
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
            index: 'helpButton',
            constructor: HelpButtonUiElement
        },
        {
            type: 'custom',
            index: 'authInformation',
            constructor: AuthInformationUiElement
        },
        {
            type: 'custom',
            index: 'languageSelect',
            constructor: LanguageSelectUiElement
        },
        {
            type: 'custom',
            index: 'orderCreator',
            constructor: OrderCreatorUiElement
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
            index: 'permalink',
            constructor: PermalinkUiElement
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