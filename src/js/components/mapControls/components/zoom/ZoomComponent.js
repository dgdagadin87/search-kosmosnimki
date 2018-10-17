import BaseComponent from '../../../../base/BaseComponent';


export default class BaseLayesrComponent extends BaseComponent {


    constructor(props) {
        super(props);

        const zoomControl = L.control.gmxZoom ({
            position: 'bottomright'
        });
        this._component = zoomControl;
    }

    init() {

        const map = this.getMap();

        map.gmxControlsManager.add(this._component);
        map.addControl(this._component);
    }

}