import Translations from 'scanex-translations';

import BaseUIElement from 'js/base/BaseUIElement';

import FormComponent from './components/form/FormComponent';


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

        this.initChildren([
            {
                index: 'form',
                constructor: FormComponent
            }
        ]);

        this._bindEvents();
    }

    _bindEvents() {

        const formComponent = this.getChildComponent('form');

        formComponent.events.on('click:copy', this._onCopyClick.bind(this));
    }

    _onShowClick() {

        const application = this.getApplication();
        const permalinkManager = application.getAddon('permalinkManager');
        const formComponent = this.getChildComponent('form');

        formComponent.showLoading();

        permalinkManager.getPermalinkId()
        .then(result => formComponent.showInput(result))
        .catch(e => this._errorHandler(e))
    }

    _onCopyClick(input) {

        const application = this.getApplication();
        const notificationText = Translations.getText('alerts.permalink');

        input.focus();
        input.select();
        document.execCommand('copy');
        
        application.showNotification(notificationText);
    }

    _errorHandler(e) {

        const application = this.getApplication();

        application.showError(e.toString());

        window.console.error(e);
    }

}