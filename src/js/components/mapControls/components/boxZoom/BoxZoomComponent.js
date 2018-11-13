import Translations from 'scanex-translations';

import BaseComponent from '../../../../base/BaseComponent';


export default class BoxZoomComponent extends BaseComponent {

    init() {

        const map = this.getMap();

        const zoomControl = new L.Control.gmxIcon({
            id: 'boxzoom',
            position: 'searchControls',
            toggle: true,
            title: Translations.getText('controls.zoom'),
            onAdd: this._onAddHandler.bind(this),
            stateChange: control => {
                if (control.options.isActive) {
                    map.dragging.disable();
                    map.boxZoom.addHooks();
                }
                else {
                    map.dragging.enable();
                    map.boxZoom.removeHooks();
                }
            }
        });

        this._view = zoomControl;

        map.gmxControlsManager.add(this._view);
        map.addControl(this._view);
    }

    _onAddHandler(control) {

        const map = this.getMap();

        const _onMouseDown = map.boxZoom._onMouseDown;

        map.boxZoom._onMouseDown = e => {
            _onMouseDown.call(map.boxZoom, {
                clientX: e.clientX,
                clientY: e.clientY,
                which: 1,
                shiftKey: true
            });
        };

        map.on('boxzoomend', () => {
            map.dragging.enable();
            map.boxZoom.removeHooks();
            control.setActive(false);
        });
    }

}