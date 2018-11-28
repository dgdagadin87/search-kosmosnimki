import LanguageWidget from 'scanex-lang-widget';
import Translations from 'scanex-translations';

import BaseUIElement from 'js/base/BaseUIElement';


export default class LangWidgetUIElement extends BaseUIElement {

    init() {

        this._container = document.getElementById('lang');

        this._view = new LanguageWidget(this._container, {
            languages: {
                'eng': 'EN',
                'rus': 'RU'
            },
        });
        this.getView().currentLanguage = Translations.getLanguage();

        this._bindEvents();
    }

    _bindEvents() {

        const application = this.getApplication();
        const permalinkManager = application.getAddon('permalinkManager');
        const view = this.getView();

        view.addEventListener('change', e => {

            const {detail: currentLanguage} = e;

            Translations.setLanguage(currentLanguage);
            L.gmxLocale.setLanguage(currentLanguage);
            
            const currentAppState = permalinkManager.getCurrentApplicationState();
            permalinkManager.saveAppStateToLocalStorage(currentAppState);

            window.location.reload(true);
        });
    }

}