import Translations from 'scanex-translations';

import BaseComponent from '../../../../base/BaseComponent';


export default class PolygonComponent extends BaseComponent {

    init() {

        const map = this.getMap();

        const controlText = Translations.getText('controls.polygon');

        const polygonControl = new L.Control.gmxIcon({
            id: 'polygon', 
            position: 'drawControls', 
            title: controlText, 
            togglable: true,
            imagePath: './dist/',
        });

        polygonControl.on('statechange', this._handleStateChange.bind(this));

        this._view = polygonControl;

        map.gmxControlsManager.add(polygonControl);
        map.addControl(polygonControl);

        this._bindEvents();
    }

    _bindEvents() {

        const {gmxDrawing} = this.getMap();
        const application = this.getApplication();
        const events = application.getAppEvents();

        gmxDrawing.on('drawstop', this._omMapDrawStop.bind(this));
        events.on('gmxIcons:clearActive', (id) => {
            const control = this.getView();
            if (id !== 'polygon') {
                control.setActive(false);
            }
        });
    }

    _omMapDrawStop(e) {

        const {object} = e;

        this._setActiveIcon(object, false);
    }

    _handleStateChange(e) {

        const {target} = e;
        const {options} = target;

        if (this._getActiveIcon() === 'polygon') {
            this._setActive();
        }
        else if (options.isActive) {
            this._setActive('polygon');
        }

        this._setActiveIcon(target, options.isActive);
    }

    _setActiveIcon (control, isActive) {

        const polygonControl = this.getView();

        this._rewriteActiveIcon(null);

        const flag = control === polygonControl && (isActive || polygonControl.options.isActive);

        polygonControl.setActive(flag);

        if (flag) {
            this._rewriteActiveIcon('polygon');
        }
    }

    _setActive (controlName) {

        const {gmxDrawing} = this.getMap();
        const {options:{isActive}} = this.getView();

        gmxDrawing.bringToFront();   

        if (controlName === 'polygon' && isActive) {
            gmxDrawing.create('Polygon');
        }
    }

    _getActiveIcon() {

        const application = this.getApplication();
        const store = application.getStore();

        return store.getData('activeIcon');
    }

    _rewriteActiveIcon(value) {

        const application = this.getApplication();
        const appEvents = application.getAppEvents();
        const store = application.getStore();

        store.rewriteData('activeIcon', value);
        appEvents.trigger('gmxIcons:clearActive', 'polygon');
    }

}