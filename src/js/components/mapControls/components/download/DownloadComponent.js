import Translations from 'scanex-translations';

import BaseCompositedComponent from '../../../../base/BaseCompositedComponent';

import ButtonComponent from './components/button/ButtonComponent';
import DialogComponent from './components/dialog/DialogComponent';


export default class DownloadComponent extends BaseCompositedComponent {

    init() {

        this.initChildren([
            {
                index: 'button',
                constructor: ButtonComponent
            },
            {
                index: 'dialog',
                constructor: DialogComponent
            }
        ]);

        this._bindEvents();
    }

    _bindEvents() {

        const buttonComponent = this.getChildComponent('button');
        const dialogComponent = this.getChildComponent('dialog');

        buttonComponent.events.on('click:show', this._onShowClick.bind(this));
        dialogComponent.events.on('click:apply', this._onApplyClick.bind(this));
        dialogComponent.events.on('click:cancel', this._onCancelClick.bind(this));
    }

    _onShowClick() {

        const application = this.getApplication();
        const store = application.getStore();
        const dialogComponent = this.getChildComponent('dialog');
        const hasResults = store.hasResults();
        const hasFavorites = store.hasFavorites();
        const hasDrawings = store.hasDrawings();

        if (hasResults || hasFavorites || hasDrawings) {
            dialogComponent.show();
        }
        else {
            const notification = Translations.getText('download.empty');
            application.showNotification(notification);
        }
    }

    _onApplyClick() {

        const application = this.getApplication();
        const store = application.getStore();
        const shapeLoader = application.getAddon('shapeLoader');
        const dialogComponent = this.getChildComponent('dialog');
        const hasDrawings = store.hasDrawings();
        const hasResults = store.hasResults();
        const hasFavorites = store.hasFavorites();
        const downloadType = dialogComponent.getType();
        const downloadName = dialogComponent.getName();

        let valid = false;
        switch (downloadType) {

            case 'borders':
                if (hasDrawings) {
                    valid = true;
                }
                break;

            case 'results':
            case 'rcsv':
                if (hasResults) {
                    valid = true;
                }
                break;

            case 'cart':
            case 'ccsv':
            case 'quicklooks':
                if (hasFavorites) {
                    valid = true;
                }
                break;

            default:
                break;

        }

        if (valid) {            
            dialogComponent.hide();
            shapeLoader.download(downloadName, downloadType);
        }        
        else {
            const notification = Translations.getText('download.noresults');
            application.showNotification(notification);
        }
    }

    _onCancelClick() {

        const dialogComponent = this.getChildComponent('dialog');

        dialogComponent.hide();
    }

}