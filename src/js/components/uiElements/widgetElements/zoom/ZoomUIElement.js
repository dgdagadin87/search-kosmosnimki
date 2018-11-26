import BaseUIElement from 'js/base/BaseUIElement';


export default class BaseLayesrUIElement extends BaseUIElement {

    init() {

        const map = this.getMap();

        const zoomControl = L.control.gmxZoom ({
            position: 'bottomright'
        });
        this._view = zoomControl;

        map.gmxControlsManager.add(this._view);
        map.addControl(this._view);
    }

}