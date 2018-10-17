import LanguageWidget from 'scanex-lang-widget';

import Translations from 'scanex-translations';

import BaseComponent from '../../base/BaseComponent';


export default class LangWidgetComponent extends BaseComponent {

    constructor(props){
        super(props);

        this._container = document.getElementById('lang');
    }

    init() {

        this._component = new LanguageWidget(this._container, {
            languages: {
                'eng': 'EN',
                'rus': 'RU'
            },
        });
        this._component.currentLanguage = Translations.getLanguage();

        this._bindEvents();
    }

    _bindEvents() {

        // localEvents.on(...)
        this._component.addEventListener('change', e => {

            const {detail: currentLanguage} = e;

            Translations.setLanguage(currentLanguage);
            L.gmxLocale.setLanguage(currentLanguage);
            //localStorage.setItem('view_state', JSON.stringify(get_state()));
            window.location.reload(true);
        });
    }

}