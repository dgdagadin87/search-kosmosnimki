import Translations from 'scanex-translations';

import BaseUIElement from 'js/base/BaseUIElement';


export default class RectangleUIElement extends BaseUIElement {

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
        const events = application.getServiceEvents();

        gmxDrawing.on('drawstop', this._omMapDrawStop.bind(this));
        events.on('gmxIcons:clearActive', (id) => id !== 'rectangle' && this.getView().setActive(false));
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

        return store.getMetaItem('activeIcon');
    }

    _rewriteActiveIcon(value) {

        const application = this.getApplication();
        const events = application.getServiceEvents();
        const store = application.getStore();

        store.setMetaItem('activeIcon', value);
        events.trigger('gmxIcons:clearActive', 'rectangle');
    }

}