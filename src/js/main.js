import 'nodelist-foreach-polyfill';

import './services/css/css';
import './services/translations/translations';

import Application from './application/Application';

import ShapeLoaderAddon from './addons/shapeLoader/ShapeLoaderAddon';

//import LoaderIndicatorComponent from './components/loaderIndicator/LoaderIndicatorComponent';
//import PopupNotificationComponent from './components/popupNotification/PopupNotificationComponent';
import HelpingButtonComponent from './components/helpingButton/HelpingButtonComponent';
import UserInformationComponent from './components/userInformation/UserInformationComponent';
import LanguageSelectComponent from './components/languageSelect/LanguageSelectComponent';
import MapControlsComponent from './components/mapControls/MapControlsComponent';
import DrawingObjectsComponent from './components/drawingObjects/DrawingObjectsComponent';
import SidebarComponent from './components/sidebar/SidebarComponent';
import MakeOrderComponent from './components/makeOrder/MakeOrderComponent';
import AboutDialogComponent from './components/aboutDialog/AboutDialogComponent';


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

    // addons
    addons: [
        {
            index: 'shapeLoader',
            constructor: ShapeLoaderAddon
        }
    ],

    // components
    components: [
        /*{
            index: 'loaderIndicator',
            constructor: LoaderIndicatorComponent
        },
        {
            index: 'popupNotification',
            constructor: PopupNotificationComponent
        },*/
        {
            index: 'helpingButton',
            constructor: HelpingButtonComponent
        },
        {
            index: 'userInformation',
            constructor: UserInformationComponent
        },
        {
            index: 'languageSelect',
            constructor: LanguageSelectComponent
        },
        {
            index: 'mapControls',
            constructor: MapControlsComponent
        },
        {
            index: 'drawingObjects',
            constructor: DrawingObjectsComponent
        },
        {
            index: 'sidebar',
            constructor: SidebarComponent
        },
        {
            index: 'makeOrder',
            constructor: MakeOrderComponent
        },
        {
            index: 'about',
            constructor: AboutDialogComponent
        }
    ]

});

application.start();