import FloatingPanel from 'scanex-float-panel';

import Translations from 'scanex-translations';

import { getWindowCenter } from 'js/utils/CommonUtils';
import { VERSION, VERSION_DATE } from 'js/config/constants/Constants';


class View extends FloatingPanel {
    constructor (container, {text, events}) {
        const {left, top} = getWindowCenter();
        super(container, {id: 'about.dialog', left, top, modal: true});
        this._text = text;
        this._container.classList.add('about-dialog');
        this._content.innerHTML = `<div class="logo-symbol-about"></div>        
        <div class="about-version">
            <div></div>
            <div>${Translations.getText('about.version')} ${VERSION}</div>
            <div></div>
        </div>
        <div class="about-date">${moment(VERSION_DATE).format('L')}</div>
        <div class="about-news">
            <div>${Translations.getText('about.news')}</div>
            <div><ul>${this._text.split(/\r?\n/g).map(x => `<li>${x}</li>`).join('')}</ul></div>
        </div>
        <div class="about-link">${Translations.getText('about.help')}</div>`;
        this._container.querySelector('.about-link').addEventListener('click', e => events.trigger('click'));
    }
}

export default About;