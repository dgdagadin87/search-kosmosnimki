import Translations from 'scanex-translations';

import BaseComponent from '../../../../base/BaseComponent';

import { isMobile } from '../../../../miskUtils/utils';


export default class DrawingsControlComponent extends BaseComponent {

    constructor(props) {

        super(props);

        this._activeIcon = null;

        const drawControlNames = isMobile() ? ['point'] : ['point','polyline','polygon','rectangle'];

        const drawControls = drawControlNames.map(controlName => {

            const controlText = Translations.getText(`controls.${controlName}`);

            const currentControl = new L.Control.gmxIcon({
                id: controlName, 
                position: 'drawControls', 
                title: controlText, 
                togglable: true,
                imagePath: './dist/',
            });

            currentControl.on('statechange', this._handleStateChange.bind(this));  

            return currentControl;
        });

        this._component = drawControls;

        this._bindEvents();
    }

    init() {

        const map = this.getMap();
        const drawControls = this._component;

        drawControls.forEach(control => {

            map.gmxControlsManager.add(control);
            map.addControl(control);
        });
    }

    _bindEvents() {

        const map = this.getMap();

        map.gmxDrawing.on('drawstop', this._omMapDrawStop.bind(this));
    }

    _omMapDrawStop(e) {

        const {object} = e;

        this._setActiveIcon(object, false);

        //...sideBar -> setSearchPanel by default
    }

    _handleStateChange(e) {

        const {target} = e;
        const {options} = target;

        const id = options.id;

        if (id === this._activeIcon) {
            this._setActive();            
        }
        else if (options.isActive) {
            this._setActive(id);            
        }

        this._setActiveIcon(target, options.isActive);
    }

    _setActiveIcon (control, isActive) {

        const drawControls = this._component;

        this._activeIcon = null;

        drawControls.forEach(currentControl => {

            const flag = control === currentControl && (isActive || currentControl.options.isActive);

            currentControl.setActive(flag);

            if (flag) { 
                this._activeIcon = currentControl.options.id;
            }
        });

        return this._activeIcon;
    }

    _setActive (controlName) {

        const map = this.getMap();

        map.gmxDrawing.bringToFront();   

        switch (controlName) {
            case 'point':
                map.gmxDrawing.create('Point');
                break;
            case 'polygon':
                map.gmxDrawing.create('Polygon');
                break;
            case 'polyline':
                map.gmxDrawing.create('Polyline');
                break;
            case 'rectangle':
                map.gmxDrawing.create('Rectangle');
                break;
            default:
                break;
        }
    }

}