import Translations from 'scanex-translations';

import BaseComponent from '../../../../base/BaseComponent';


export default class PointComponent extends BaseComponent {

    init() {

        const map = this.getMap();

        const controlText = Translations.getText('controls.point');

        const pointControl = new L.Control.gmxIcon({
            id: 'point', 
            position: 'drawControls', 
            title: controlText, 
            togglable: true,
            imagePath: './dist/',
        });

        pointControl.on('statechange', this._handleStateChange.bind(this));

        this._view = pointControl;

        map.gmxControlsManager.add(pointControl);
        map.addControl(pointControl);

        this._bindEvents();
    }

    _bindEvents() {

        const {gmxDrawing} = this.getMap();
        const application = this.getApplication();
        const events = application.getAppEvents();

        gmxDrawing.on('drawstop', this._omMapDrawStop.bind(this));
        events.on('gmxIcons:clearActive', (id) => {
            const control = this.getView();
            if (id !== 'point') {
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

        if (this._getActiveIcon() === 'point') {
            this._setActive();
        }
        else if (options.isActive) {
            this._setActive('point');
        }

        this._setActiveIcon(target, options.isActive);
    }

    _setActiveIcon (control, isActive) {

        const pointControl = this.getView();

        this._rewriteActiveIcon(null);

        const flag = control === pointControl && (isActive || pointControl.options.isActive);

        pointControl.setActive(flag);

        if (flag) {
            this._rewriteActiveIcon('point');
        }
    }

    _setActive (controlName) {

        const {gmxDrawing} = this.getMap();
        const {options:{isActive}} = this.getView();

        gmxDrawing.bringToFront();   

        if (controlName === 'point' && isActive) {
            gmxDrawing.create('Point');
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
        appEvents.trigger('gmxIcons:clearActive', 'point');
    }

}