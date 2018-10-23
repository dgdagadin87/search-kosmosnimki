import LanguageWidget from 'scanex-lang-widget';

import Translations from 'scanex-translations';

import BaseComponent from '../../base/BaseComponent';


export default class LangWidgetComponent extends BaseComponent {

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

        // localEvents.on(...)
        this.getView().addEventListener('change', e => {

            const {detail: currentLanguage} = e;

            Translations.setLanguage(currentLanguage);
            L.gmxLocale.setLanguage(currentLanguage);
            //localStorage.setItem('view_state', JSON.stringify(get_state()));
            window.location.reload(true);
        });
    }

}