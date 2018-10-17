import Translations from 'scanex-translations';
import IconLayers from 'leaflet-iconlayers';

import BaseComponent from '../../../../base/BaseComponent';


export default class BaseLayersComponent extends BaseComponent {


    constructor(props) {
        super(props);

        this._setLanguage();
        this._setLayers();
        
    }

    init() {

        const map = this.getMap();

        const baseLayersControl = new IconLayers(this._layers, {
            id: 'iconLayers'
        });
        map.gmxControlsManager.add(baseLayersControl);
        map.addControl(baseLayersControl);
    
        this._shiftControl();

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const globalEvents = application.getAppEvents();

        globalEvents.on('sideBar:open', () => this._shiftControl());
        globalEvents.on('sideBar:change', () => this._shiftControl());
        globalEvents.on('sideBar:close', () => this._shiftControl());
    }

    _setLanguage() {

        this._language = Translations.getLanguage() || 'rus';
    }

    _setLayers() {

        const map = this.getMap();
        const {gmxBaseLayersManager} = map;
        const activeIds = gmxBaseLayersManager.getActiveIDs();

        const layers = activeIds.map(id => {
            const layer = gmxBaseLayersManager.get(id);
            if (!layer) {
                return null;
            }
            else {
                return {
                    layer: layer,
                    icon: layer.options.icon,
                    title: layer.options[this._language]
                };
            }
        });

        this._layers = layers.filter(e => e);
    }

    _shiftControl() {

        const map = this.getMap();
        //const { width } = window.Catalog.searchSidebar.getContainer().getBoundingClientRect();
        const width = 0;

        map.gmxControlsManager.get('iconLayers').getContainer().style.left = `${width + 30}px`;
    }

}