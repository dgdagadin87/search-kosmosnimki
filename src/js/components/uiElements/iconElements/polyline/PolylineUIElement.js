import Translations from 'scanex-translations';

import BaseUIElement from 'js/base/BaseUIElement';


export default class PolylineUIElement extends BaseUIElement {

    init() {

        const map = this.getMap();

        const controlText = Translations.getText('controls.polyline');

        const polylineControl = new L.Control.gmxIcon({
            id: 'polyline', 
            position: 'drawControls', 
            title: controlText, 
            togglable: true,
            imagePath: './dist/',
        });

        polylineControl.on('statechange', this._handleStateChange.bind(this));

        this._view = polylineControl;

        map.gmxControlsManager.add(polylineControl);
        map.addControl(polylineControl);

        this._bindEvents();
    }

    _bindEvents() {

        const {gmxDrawing} = this.getMap();
        const application = this.getApplication();
        const events = application.getServiceEvents();

        gmxDrawing.on('drawstop', this._omMapDrawStop.bind(this));
        events.on('gmxIcons:clearActive', (id) => id !== 'polyline' && this.getView().setActive(false));
    }

    _omMapDrawStop(e) {

        const {object} = e;

        this._setActiveIcon(object, false);
    }

    _handleStateChange(e) {

        const {target} = e;
        const {options} = target;

        if (this._getActiveIcon() === 'polyline') {
            this._setActive();
        }
        else if (options.isActive) {
            this._setActive('polyline');
        }

        this._setActiveIcon(target, options.isActive);
    }

    _setActiveIcon (control, isActive) {

        const polylineControl = this.getView();

        this._rewriteActiveIcon(null);

        const flag = control === polylineControl && (isActive || polylineControl.options.isActive);

        polylineControl.setActive(flag);

        if (flag) {
            this._rewriteActiveIcon('polyline');
        }
    }

    _setActive (controlName) {

        const {gmxDrawing} = this.getMap();
        const {options:{isActive}} = this.getView();

        gmxDrawing.bringToFront();   

        if (controlName === 'polyline' && isActive) {
            gmxDrawing.create('Polyline');
        }
    }

    _getActiveIcon() {

        const application = this.getApplication();
        const store = application.getStore();

        return store.getMetaItem('activeIcon');
    }

    _rewriteActiveIcon(value) {

        const application = this.getApplication();
        const events = application.getServiceEvents();
        const store = application.getStore();

        store.setMetaItem('activeIcon', value);
        events.trigger('gmxIcons:clearActive', 'polyline');
    }

}