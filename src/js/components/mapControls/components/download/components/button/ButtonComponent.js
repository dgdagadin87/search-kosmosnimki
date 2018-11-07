import Translations from 'scanex-translations';

import BaseComponent from '../../../../../../base/BaseComponent';


export default class ButtonComponent extends BaseComponent {

    init() {

        const map = this.getMap();

        const downloadControl = new L.Control.gmxIcon({
            id: 'download',
            position: 'searchControls',
            title: Translations.getText('controls.download'),
            stateChange: control => {
                if ((window.Catalog.resultsController.resultsCount + window.Catalog.resultsController.favoritesCount) > 0 || window.Catalog.drawnObjectsControl.widget.items.length) {
                    dlgDownload.style.display = 'block';                
                }
                else {
                    window.Catalog.notificationWidget.content.innerText = Translations.getText('download.empty');
                    window.Catalog.notificationWidget.show();
                }
            }
        });

        this._view = downloadControl;

        map.gmxControlsManager.add(this._view);
        map.addControl(this._view);
    }

}