import Translations from 'scanex-translations';
import IconLayers from 'leaflet-iconlayers';

import BaseCompositedComponent from 'js/base/BaseCompositedComponent';

import LegendComponent from './components/legend/LegendComponent';


export default class BaseLayersComponent extends BaseCompositedComponent {

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

        this.initChildren([
            {
                index: 'legend',
                constructor: LegendComponent
            }
        ]);

        this._setActiveLayer();

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const globalEvents = application.getAppEvents();
        const store = application.getStore();
        const view = this.getView();

        globalEvents.on('system:uiElements:created', () => this._shiftControl());
        store.on('currentTab:changeMeta', () => this._shiftControl());
        store.on('activeLayer:change', () => this._showLegend());
        store.on('activeLayer:changeFromPermalink', () => this._setGmxIconLayer());
        view.on('activelayerchange', this._setActiveLayer.bind(this));
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
            const legendComponent = this.getChildComponent('legend');

            const { width } = sideBarComponent.getView().getContainer().getBoundingClientRect();
            const correctWidth = width + 30;

            map.gmxControlsManager.get('iconLayers').getContainer().style.left = `${correctWidth}px`;
            legendComponent.shift(correctWidth);
        }, 0);
    }

    _setActiveLayer() {

        const application = this.getApplication();
        const store = application.getStore();
        const view = this.getView();
        const {layer = {}} = view._getActiveLayer();

        store.setMetaItem('activeLayer', layer['id'], ['activeLayer:change']);
    }

    _setGmxIconLayer() {

        const application = this.getApplication();
        const {gmxBaseLayersManager} = this.getMap();
        const store = application.getStore();
        const view = this.getView();
        const activeLayer = store.getMetaItem('activeLayer');

        const activeLayerObject = gmxBaseLayersManager.get(activeLayer);
        view.setActiveLayer(activeLayerObject);
    }

    _showLegend() {

        const application = this.getApplication();
        const store = application.getStore();
        const activeLayer = store.getMetaItem('activeLayer');
        const legendComponent = this.getChildComponent('legend');

        if (activeLayer === 'heatmap2018') {
            legendComponent.show();
        }
        else {
            legendComponent.hide();
        }
    }

}