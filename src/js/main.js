import './cssEntry/cssEntry';
import './config/translations/common';

import Application from './base/Application';


const application = new Application({
    components: ['foo', 'bar'],
    services: ['bar', 'baz']
});
application.start();