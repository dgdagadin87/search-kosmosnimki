import BaseComponent from '../../base/BaseComponent';

import BaseLayersComponent from './components/baseLayers/BaseLayersComponent';


export default class MapControlsComponent extends BaseComponent {


    constructor(props) {
        super(props);

        this._baseLayersComponent = new BaseLayersComponent(props);
    }

    init() {

        this._baseLayersComponent.init();
    }

    getBaseLayersComponent() {

        return this._baseLayersComponent ;
    }

}