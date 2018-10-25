import './cssEntry/cssEntry';
import './config/translations/common';
import './config/translations/about';
import './config/translations/drawnObjects';
import './config/translations/searchOptions';

import Application from './core/Application';

import CrdSearchProvider from './searchProviders/crdProvider/CrdSearchProvider';
import OsmSearchProvider from './searchProviders/osmProvider/OsmSearchProvider';
import GmxSearchProvider from './searchProviders/gmxProvider/GmxSearchProvider';

import LoaderIndicatorComponent from './components/loaderIndicator/LoaderIndicatorComponent';
import PopupNotificationComponent from './components/popupNotification/PopupNotificationComponent';

import HelpingButtonComponent from './components/helpingButton/HelpingButtonComponent';
import UserInformationComponent from './components/userInformation/UserInformationComponent';
import LanguageSelectComponent from './components/languageSelect/LanguageSelectComponent';
import MapControlsComponent from './components/mapControls/MapControlsComponent';

import DrawingObjectsComponent from './components/drawingObjects/DrawingObjectsComponent';

import SidebarComponent from './components/sidebar/SidebarComponent';

import AboutDialogComponent from './components/aboutDialog/AboutDialogComponent';


const application = new Application({

    // search providers
    searchProviders: [
        {
            index: 'crdProvider',
            constructor: CrdSearchProvider
        },
        {
            index: 'osmProvider',
            constructor: OsmSearchProvider
        },
        {
            index: 'gmxProvider',
            constructor: GmxSearchProvider
        }
    ],

    // components
    components: [
        {
            index: 'loaderIndicator',
            constructor: LoaderIndicatorComponent
        },
        {
            index: 'popupNotification',
            constructor: PopupNotificationComponent
        },
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
            index: 'about',
            constructor: AboutDialogComponent
        }
    ],

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
                'key': 'searchCriteria',
                'isTable': false
            },
            {
                'key': 'cancelLoading',
                'isTable': false
            }
        ]
    }

});

application.start();