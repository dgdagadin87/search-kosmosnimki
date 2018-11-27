import Translations from 'scanex-translations';

import BaseUIElement from 'js/base/BaseUIElement';


export default class PermalinkUIElement extends BaseUIElement {

    init() {

        const map = this.getMap();

        const permalinkControl = new L.Control.gmxIcon({
            id: 'link',
            position: 'searchControls',
            title: Translations.getText('controls.permalink'),
            stateChange: this._onShowClick.bind(this)
        });

        this._view = permalinkControl;

        map.gmxControlsManager.add(this._view);
        map.addControl(this._view);

        /*this.initChildren([
            {
                index: 'dialog',
                constructor: DialogComponent
            }
        ]);*/

        this._bindEvents();
    }

    _bindEvents() {

        /*const dialogComponent = this.getChildComponent('dialog');

        dialogComponent.events.on('click:apply', this._onApplyClick.bind(this));*/
    }

    _onShowClick() {

        console.log('onShow');
    }

    _errorHandler(e) {

        const application = this.getApplication();

        application.showError(Translations.getText('errors.upload'));

        window.console.error(e);
    }

}