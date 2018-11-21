import Translations from 'scanex-translations';

import BaseComponent from 'js/base/BaseComponent';


export default class RectangleComponent extends BaseComponent {

    init() {

        const map = this.getMap();

        const controlText = Translations.getText('controls.rectangle');

        const rectangleControl = new L.Control.gmxIcon({
            id: 'rectangle', 
            position: 'drawControls', 
            title: controlText, 
            togglable: true,
            imagePath: './dist/',
        });

        rectangleControl.on('statechange', this._handleStateChange.bind(this));

        this._view = rectangleControl;

        map.gmxControlsManager.add(rectangleControl);
        map.addControl(rectangleControl);

        this._bindEvents();
    }

    _bindEvents() {

        const {gmxDrawing} = this.getMap();
        const application = this.getApplication();
        const events = application.getAppEvents();

        gmxDrawing.on('drawstop', this._omMapDrawStop.bind(this));
        events.on('gmxIcons:clearActive', (id) => {
            const control = this.getView();
            if (id !== 'rectangle') {
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

        if (this._getActiveIcon() === 'rectangle') {
            this._setActive();
        }
        else if (options.isActive) {
            this._setActive('rectangle');
        }

        this._setActiveIcon(target, options.isActive);
    }

    _setActiveIcon (control, isActive) {

        const rectangleControl = this.getView();

        this._rewriteActiveIcon(null);

        const flag = control === rectangleControl && (isActive || rectangleControl.options.isActive);

        rectangleControl.setActive(flag);

        if (flag) {
            this._rewriteActiveIcon('rectangle');
        }
    }

    _setActive (controlName) {

        const {gmxDrawing} = this.getMap();
        const {options:{isActive}} = this.getView();

        gmxDrawing.bringToFront();   

        if (controlName === 'rectangle' && isActive) {
            gmxDrawing.create('Rectangle');
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
        appEvents.trigger('gmxIcons:clearActive', 'rectangle');
    }

}