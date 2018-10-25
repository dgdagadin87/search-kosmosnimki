import './cssEntry/cssEntry';
import './config/translations/common';
import './config/translations/about';
import './config/translations/drawnObjects';
import './config/translations/searchOptions';

import Application from './core/Application';

import CrdSearchProvider from './searchProviders/crdProvider/CrdSearchProvider';
import OsmSearchProvider from './searchProviders/osmProvider/OsmSearchProvider';
import GmxSearchProvider from './searchProviders/gmxProvider/GmxSearchProvider';

import LoaderWidgetComponent from './components/loaderWidget/LoaderWidgetComponent';
import NotificationWidgetComponent from './components/notificationWidget/NotificationWidgetComponent';

import HelpButtonComponent from './components/helpButton/HelpButtonComponent';
import AuthWidgetComponent from './components/authWIdget/AuthWidgetComponent';
import LangWidgetComponent from './components/langWIdget/LangWidgetComponent';
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
            index: 'loaderWidget',
            constructor: LoaderWidgetComponent
        },
        {
            index: 'notificationWidget',
            constructor: NotificationWidgetComponent
        },
        {
            index: 'helpButton',
            constructor: HelpButtonComponent
        },
        {
            index: 'authWidget',
            constructor: AuthWidgetComponent
        },
        {
            index: 'langWidget',
            constructor: LangWidgetComponent
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

        // dialogs
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