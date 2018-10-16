import './cssEntry/cssEntry';
import './config/translations/common';

import Application from './base/Application';

import CatalogResourceServerService from './services/catalogResourceServer/CatalogResourceServerService';
import GmxResourceServerService from './services/gmxResourceServer/GmxResourceServerService';


const application = new Application({

    // components
    components: [],

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
            'userInfo'
        ]
    }

});
application.start();