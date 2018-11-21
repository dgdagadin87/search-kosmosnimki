import Translations from 'scanex-translations';

import BaseComponent from 'js/base/BaseComponent';


export default class ButtonComponent extends BaseComponent {

    init() {

        const map = this.getMap();

        const uploadControl = new L.Control.gmxIcon({
            id: 'upload',
            position: 'searchControls',
            title: Translations.getText('controls.upload'),
            stateChange: () => this.events.trigger('click:show')
        });

        this._view = uploadControl;

        map.gmxControlsManager.add(this._view);
        map.addControl(this._view);
    }

}