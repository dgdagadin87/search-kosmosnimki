import './cssEntry/cssEntry';
import './config/translations/common';
import './config/translations/about';
import './config/translations/drawnObjects';

import Application from './core/Application';

import CatalogResourceServerService from './services/catalogResourceServer/CatalogResourceServerService';
import GmxResourceServerService from './services/gmxResourceServer/GmxResourceServerService';

import HelpButtonComponent from './components/helpButton/HelpButtonComponent';
import AuthWidgetComponent from './components/authWIdget/AuthWidgetComponent';
import LangWidgetComponent from './components/langWIdget/LangWidgetComponent';
import MapControlsComponent from './components/mapControls/MapControlsComponent';

import AboutDialogComponent from './components/aboutDialog/AboutDialogComponent';


const application = new Application({

    // components
    components: [
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

        // dialogs
        {
            index: 'about',
            constructor: AboutDialogComponent
        }
    ],

    // services
    services: [
        {
            index: 'catalogServer',
            constructor: CatalogResourceServerService
        },
        {
            index: 'gmxServer',
            constructor: GmxResourceServerService
        }
    ],

    //store
    store: {
        'name': 'searchStore',
        'constantable': [
            'userInfo',
            'about'
        ],
        'changeable': [
            {
                'key': 'drawings',
                'isTable': true,
                'indexBy': 'id'
            }
        ]
    }

});

application.start();