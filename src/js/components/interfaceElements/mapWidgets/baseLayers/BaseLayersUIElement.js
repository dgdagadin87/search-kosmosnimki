import Translations from 'scanex-translations';
import IconLayers from 'leaflet-iconlayers';

import BaseComponent from 'js/base/BaseComponent';


export default class BaseLayersComponent extends BaseComponent {

    init() {

        const map = this.getMap();

        this._setLanguage();
        this._setLayers();

        const baseLayersControl = new IconLayers(this._layers, {
            id: 'iconLayers'
        });

        this._view = baseLayersControl;

        map.gmxControlsManager.add(baseLayersControl);
        map.addControl(baseLayersControl);

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const globalEvents = application.getAppEvents();

        globalEvents.on('system:uiElements:created', () => this._shiftControl());
        globalEvents.on('sidebar:tab:afterchange', () => this._shiftControl());
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

        setTimeout(() => {
            const map = this.getMap();

            const application = this.getApplication();
            const sideBarComponent = application.getUiElement('sidebar');

            const { width } = sideBarComponent.getView().getContainer().getBoundingClientRect();

            map.gmxControlsManager.get('iconLayers').getContainer().style.left = `${width + 30}px`;
        }, 0);
    }

}