import { RangeWidget } from 'scanex-slider-widget';

import Satellites from './Satellites.js';
import EventTarget from 'scanex-event-target';
import Translations from 'scanex-translations';

import Pikaday  from 'pikaday';


class SearchOptions extends EventTarget {
  constructor (container, { restricted }){
    super();
    this._container = container;    
    this._container.classList.add('search-options');    
    this._content = this._container;
    this._content.innerHTML = 
    `<div class="no-select search-options-fixed-section">
      <div class="search-options-period-title">${Translations.getText('period.title')}</div>
      <div class="search-options-period-section">
        <div class="search-options-period">
          <div class="search-options-period-from">${Translations.getText('period.from')}</div>
          <input class="search-options-period-from-value" type="text"/>      
          <div class="search-options-period-to">${Translations.getText('period.to')}</div>
          <input class="search-options-period-to-value" type="text" />
        </div>
        <div class="search-options-period-annually">
          <input id="period_annually" class="search-options-period-annually-value" type="checkbox" />
          <label for="period_annually" class="search-options-period-annually-title">${Translations.getText('period.annually')}</label>
        </div>    
      </div>
      <div class="search-options-clouds">      
        <div class="search-options-clouds-title">${Translations.getText('clouds')}</div>
        <div class="search-options-clouds-value"></div>      
      </div>    
      <div class="search-options-angle">      
        <div class="search-options-angle-title">${Translations.getText('angle')}</div>
        <div class="search-options-angle-value"></div>      
      </div>
      <div class="search-options-resolution">      
        <div class="search-options-resolution-title">${Translations.getText('resolution.title')}</div>
        <div class="search-options-resolution-value"></div>      
      </div>    
      <div class="search-options-satellites-number-section">
        <div class="search-options-satellites-title">${Translations.getText('satellites')}</div>
        <div class="search-options-satellites-number"></div>
        <div class="search-options-satellites-archive">
            <!-- label class="search-options-satellites-archive-title">${Translations.getText('archive.title')}</label -->
            <select>
                <option value="global">${Translations.getText('archive.global')}</option>
                <option value="local">${Translations.getText('archive.local')}</option>
                <option value="all">${Translations.getText('archive.all')}</option>
            </select>
            <!-- input id="satellite_stereo" type="checkbox" value="stereo" / -->
            <!-- label for="satellite_stereo">${Translations.getText('stereo')}</label -->
        </div>
      </div>
    </div>
    <div class="no-select search-options-satellites"></div>`;

    this._content.classList.add('search-options-content');
    this._satellitesContainer = this._container.querySelector('.search-options-satellites');    
    this._initDatePickers();
    this._initAnnually();    
    this._initSliders();
    this._initSatellites(restricted);
    this._initArchive(restricted);
    this._stopPropagation = this._stopPropagation.bind(this);
    this._container.addEventListener('click', this._stopPropagation);
    // this._container.addEventListener('mousemove', this._stopPropagation);
  }   
  _stopPropagation (e) {
    e.stopPropagation();
  }
  set criteria ({
    date: [startDate = new Date(), endDate = new Date()],
    annually = false,
    clouds: [minClouds = 0, maxClouds = 100],
    angle: [minAngle = 0, maxAngle = 60],    
    satellites = {},
    stereo = false,
  }){    
    this._startDate.setDate(startDate);
    this._endDate.setDate(endDate);
    this._annually.checked = annually;
    // this._stereo.checked = stereo;

    this._cloudSlider.values = [minClouds, maxClouds];    
    this._angleSlider.values = [minAngle, maxAngle];
    
    this._satellites.data = satellites;
    this._updateResolution();
    this._updateSatelliteNumber();
  }
  get criteria (){    
    return {
      date: [this._startDate.getDate(), this._endDate.getDate()],
      annually: this._annually.checked,
      clouds: this._cloudSlider.values,
      angle:  this._angleSlider.values,
      satellites: this._satellites.data,
      stereo: false,
      archive: this._archive.value,
    };
  }  
  _initAnnually(){
    this._annually = this._container.querySelector('.search-options-period-annually-value');
    
    this._annually.addEventListener('change', () => {

      let event = document.createEvent('Event');
      event.detail = this.criteria;
      event.initEvent('change', false, false);
      this.dispatchEvent(event);
    })
  } 
  _initDatePickers() {
    this._dateFormat = 'dd.mm.yy';
    let i18n = {
      previousMonth : 'Предыдущий месяц',
      nextMonth     : 'Следующий месяц',
      months        : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
      weekdays      : ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
      weekdaysShort : ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
    };
    switch (Translations.getLanguage()){
      default:
      case 'rus':
        moment.locale('ru');
        break;
      case 'eng':
        moment.locale('en');
        i18n = {
          previousMonth : 'Previous Month',
          nextMonth     : 'Next Month',
          months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
          weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
          weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        };
        break;
    }

    const endDate = new Date();    
    const startDate = new Date(endDate.getFullYear(), 0, 1);
    
    const startDateField = this._container.querySelector('.search-options-period-from-value');
    const endDateField = this._container.querySelector('.search-options-period-to-value');

    this._startDate = new Pikaday ({
      field: startDateField,
      // format: 'L', 
      format: 'DD.MM.YYYY',
      yearRange: 20,
      i18n: i18n,
      keyboardInput: false,
      blurFieldOnSelect: false
    });
    
    this._endDate = new Pikaday ({
      field: endDateField,
      // format: 'L', 
      format: 'DD.MM.YYYY',
      yearRange: 20,
      i18n: i18n,
      keyboardInput: false,
      blurFieldOnSelect: false,
    });

    const onChangeDatesHandler = () => {
      let event = document.createEvent('Event');
      event.detail = this.criteria;
      event.initEvent('change', false, false);
      this.dispatchEvent(event);
    }

    startDateField.addEventListener('change', onChangeDatesHandler);
    endDateField.addEventListener('change', onChangeDatesHandler);

  }
  _initArchive (restricted) {
    this._archive = this._container.querySelector('.search-options-satellites-archive select');
    this._archive.style.display = restricted ? 'block' : 'none';
    if(!restricted) {
      this._archive.value = 'global';
    }
  }
  _initSliders(){    
    this._cloudSlider = new RangeWidget(this._container.querySelector('.search-options-clouds-value'), {min: 0, max: 100});
    this._cloudSlider.values = [0, 100];   

    this._cloudSlider.addEventListener('stop', e => { 

      let event = document.createEvent('Event');
      event.detail = this.criteria;
      event.initEvent('change', false, false);
      this.dispatchEvent(event);
    });

    this._angleSlider = new RangeWidget( this._container.querySelector('.search-options-angle-value'), {min: 0, max: 60});
    this._angleSlider.values = [0, 60];

    this._angleSlider.addEventListener('stop', e => { 

      let event = document.createEvent('Event');
      event.detail = this.criteria;
      event.initEvent('change', false, false);
      this.dispatchEvent(event);
    });

    this._resolutionSlider = new RangeWidget(this._container.querySelector('.search-options-resolution-value'), {min: 0.3, max: 20, mode: 'float'});
    this._resolutionSlider.values = [0.3, 20];
    this._resolutionSlider.addEventListener('change', e => {      
      this._satellites.range = e.detail;
    });
    this._resolutionSlider.addEventListener('stop', e => {      
      let event = document.createEvent('Event');
      event.detail = this.criteria;
      event.initEvent('change', false, false);
      this.dispatchEvent(event);
    });
  }
  _initSatellites(restricted) {    
    this._satelliteNumber = this._container.querySelector('.search-options-satellites-number'); 
    this._satellites = new Satellites (this._satellitesContainer, {restricted: restricted});
    this._satellites.addEventListener('change', e => {      
      this._updateResolution();      
      this._updateSatelliteNumber();

      let event = document.createEvent('Event');
      event.detail = this.criteria;
      event.initEvent('change', false, false);
      this.dispatchEvent(event);

    });
  }
  _updateResolution () {
    let range = this._satellites.range;
    let values = this._resolutionSlider.values;    
    if(range.length === 2) {
      let [lo, hi] = range;
      let [min, max] = values;
      this._resolutionSlider.values = [min > lo ? lo : min, max < hi ? hi : max];
    }
    else {
      this._resolutionSlider.values = values;
    }
  }
  _satellitesVisible () {
    return this._satellitesContainer.style.display == 'block';
  }
  showSatellites() {        
    this._satellitesContainer.style.display = 'block';
  }
  hideSatellites() {
    this._satellitesContainer.style.display = 'none';
  }
  _setSliderValues (values, updateSatellitesSelection) {
    this._resolutionSlider.values = values;
    this._handleResolutionsSliderMove(values, updateSatellitesSelection);
  }  
  _updateSatelliteNumber(){
    this._satelliteNumber.innerText = this._satellites.count;
  }
  _handleSearch() {
    
    let event = document.createEvent('Event');
    event.initEvent('search', false, false);
    event.detail = {
      date: [this._startDate.getDate(), this._endDate.getDate()],
      annually: this._annually.checked,
      clouds: this._cloudSlider.values,
      angle:  this._angleSlider.values,
      satellites: this._satellites.items,
    };
    this.dispatchEvent(event);
  }
  resize(total) {
    let height = this._container.querySelector('.search-options-fixed-section').getBoundingClientRect().height;
    this._container.querySelector('.search-options-satellites').style.maxHeight = `${total - height - 33}px`;
  }
  refresh() {
    this.criteria = this.criteria;
  }
  get selected () {
    return this._satellites._ms.some(x => x.checked) || this._satellites._pc.some(x => x.checked);
  }
}

export default SearchOptions;