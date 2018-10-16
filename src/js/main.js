import './cssEntry/cssEntry';
import './config/translations/common';

import Application from './core/Application';

import CatalogResourceServerService from './services/catalogResourceServer/CatalogResourceServerService';
import GmxResourceServerService from './services/gmxResourceServer/GmxResourceServerService';

import AuthWidgetComponent from './components/authWIdget/AuthWidgetComponent';


const application = new Application({

    // components
    components: [
        {
            index: 'authWidget',
            constructor: AuthWidgetComponent
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