import BaseComponent from '../../base/BaseComponent';

import BaseLayersComponent from './components/baseLayers/BaseLayersComponent';
import ZoomComponent from './components/zoom/ZoomComponent';


export default class MapControlsComponent extends BaseComponent {


    constructor(props) {
        super(props);

        this._baseLayersComponent = new BaseLayersComponent(props);
        this._zoomComponent = new ZoomComponent(props);
    }

    init() {

        this._baseLayersComponent.init();
        this._zoomComponent.init();
    }

    getBaseLayersComponent() {

        return this._baseLayersComponent ;
    }

}