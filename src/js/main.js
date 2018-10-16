import './cssEntry/cssEntry';
import './config/translations/common';
import './config/translations/about';

import Application from './core/Application';

import CatalogResourceServerService from './services/catalogResourceServer/CatalogResourceServerService';
import GmxResourceServerService from './services/gmxResourceServer/GmxResourceServerService';

import HelpButtonComponent from './components/helpButton/HelpButtonComponent';
import AuthWidgetComponent from './components/authWIdget/AuthWidgetComponent';
import AboutComponent from './components/aboutDialog/AboutDialogComponent';


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

        // dialogs
        {
            index: 'about',
            constructor: AboutComponent
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
        'constant': [
            'userInfo',
            'about'
        ]
    }

});
application.start();