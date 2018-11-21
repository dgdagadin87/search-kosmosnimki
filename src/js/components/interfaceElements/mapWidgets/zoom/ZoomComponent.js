import BaseComponent from 'js/base/BaseComponent';


export default class BaseLayesrComponent extends BaseComponent {

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