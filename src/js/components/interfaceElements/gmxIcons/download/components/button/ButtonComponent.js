import Translations from 'scanex-translations';

import BaseComponent from 'js/base/BaseComponent';


export default class ButtonComponent extends BaseComponent {

    init() {

        const map = this.getMap();

        const downloadControl = new L.Control.gmxIcon({
            id: 'download',
            position: 'searchControls',
            title: Translations.getText('controls.download'),
            stateChange: () => this.events.trigger('click:show')
        });

        this._view = downloadControl;

        map.gmxControlsManager.add(this._view);
        map.addControl(this._view);
    }

}