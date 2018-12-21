import Translations from 'scanex-translations';
import ExtendedDataGrid from './ExtendedDataGrid';

import { getSatelliteName, getPanelHeight } from 'js/utils/CommonUtils';
import EventTarget from 'scanex-event-target';


class ResultList extends EventTarget {
    constructor({ application, restricted }){
        super();    
        this._cart = {};
        this._application = application;
        this._restricted = restricted;
        this._container = document.querySelector('#map div.noselect.leaflet-control div.panes div.results-pane');
        this._container.classList.add('result-list');
        this._onColumnClick = this._onColumnClick.bind(this);
        this._onCellClick = this._onCellClick.bind(this);
        this._onRowMouseOver = this._onRowMouseOver.bind(this);
        this._onRowMouseOut = this._onRowMouseOut.bind(this);
        this._onSort = this._onSort.bind(this);
        this._activeInfo = null;
        this._disableMouseHover = false;
        this._indexBy = 'gmx_id';
        this._fields = {             
            'visible': {                
                type: 'string',                    
                icon: 'search',
                default: false,
                width: 30,
                styler: item => {
                    switch (item.visible) {
                        case 'visible':
                            return 'search search-visibility-off';
                        case 'hidden':
                            return 'search search-visibility-on';
                        case 'loading':
                            return 'search-visibility-loading';
                        case 'failed':
                            return 'search-visibility-failed';
                        default:
                            return '';
                    }                    
                }            
            },
            'stereo': {
                columnIcon: 'search search-stereo',
                type: 'boolean',
                icon: 'search',
                yes: 'search-stereo',
                sortable: true,
                default: false,
                tooltip: Translations.getText('results.stereo'),
                width: 32,
                formatter: item => {                    
                    switch (typeof item.stereo) {
                        case 'string':
                            return item.stereo !== 'NONE' && item.stereo !== '';
                        case 'boolean':
                            return item.stereo;
                        default:
                            return false;
                    }
                },
            },                               
            'platform': {
                type: 'string',
                name: Translations.getText('results.satellite'),
                sortable: true,
                formatter: item =>  {
                    let satelliteName = '';
                    switch(item.platform) {
                        case 'SPOT6':                        
                        case 'SPOT 6':
                            satelliteName = item.islocal ? 'SPOT 6' : 'SPOT 6 (A)';
                            break;
                        case 'SPOT7':
                        case 'SPOT 7':
                            satelliteName = item.islocal ? 'SPOT 7' : 'SPOT 7 (A)';
                            break;
                        case 'SPOT-6':                        
                            satelliteName = item.product ? 'SPOT 6 (P)' : 'SPOT 6';
                            break;
                        case 'SPOT-7':
                            satelliteName = item.product ? 'SPOT 7 (P)' : 'SPOT 7';
                            break;
                        case 'SPOT 5':
                            let sp5 = 'SPOT 5';
                            if (item.sensor === 'J') {
                                if (item.spot5_a_exists & item.spot5_b_exists) {
                                    sp5 = 'SPOT 5 - 2.5ms';
                                }
                                else if (item.spot5_a_exists || item.spot5_b_exists) {
                                    sp5 = 'SPOT 5 - 5ms';
                                }
                                else {
                                    sp5 = 'SPOT 5 - 10ms';
                                }
                            }
                            else if (item.sensor === 'A' || item.sensor === 'B' && !item.spot5_b_exists) {                            
                                sp5 = 'SPOT 5 - 5pan';
                            }
                            else if (item.sensor === 'A' && item.spot5_b_exists) {
                                sp5 = 'SPOT 5 - 2.5pan';
                            }                            
                            satelliteName = `${sp5}${item.islocal ? '' : ' (A)'}`;
                            break;
                        case 'Ресурс-П1':
                        case 'Ресурс-П2':
                        case 'Ресурс-П3':
                            if (item.spot5_a_exists && !item.spot5_b_exists) {
                                satelliteName = `${item.platform} pan`;
                            }
                            else if (item.spot5_b_exists) {
                                satelliteName = `${item.platform} ms`;
                            }
                            else {
                                return item.platform;
                            }    
                            break;
                        case 'GF1':
                            switch (item.sensor) {
                                case 'A':
                                    satelliteName = 'GaoFen-1 (2m)';
                                    break;
                                case 'B':
                                    satelliteName = 'GaoFen-1 (16m)';
                                    break;
                                default:
                                    satelliteName = 'GaoFen-1';
                            }
                            break;
                        case '1A-PHR-1A':
                            satelliteName = '1ATLAS (PHR-1A)';
                            break;
                        case '1A-PHR-1B':
                            satelliteName = '1ATLAS (PHR-1B)';
                            break;
                        case '1A-SPOT-6':
                            satelliteName = '1ATLAS (SP6)';
                            break;
                        case '1A-SPOT-7':
                            satelliteName = '1ATLAS (SP7)';
                            break;
                        case 'TripleSat Constellation-1':
                            satelliteName = 'Triplesat-1';
                            break;
                        case 'TripleSat Constellation-2':
                            satelliteName = 'Triplesat-2';
                            break;
                        case 'TripleSat Constellation-3':
                            satelliteName = 'Triplesat-3';
                            break;
                        case 'GJ1A':
                            satelliteName = 'Superview-1 01';
                            break;
                        case 'GJ1B':
                            satelliteName = 'Superview-1 02';
                            break;
                        case 'GJ1C':
                            satelliteName = 'Superview-1 03';
                            break;
                        case 'GJ1D':
                            satelliteName = 'Superview-1 04';
                            break;
                        case 'PHR1A':
                        case 'PHR-1A':
                            satelliteName = 'Pléiades-1A';
                            break;
                        case 'PHR1B':
                        case 'PHR-1B':
                            satelliteName = 'Pléiades-1B';
                            break;
                        default:
                            satelliteName = `${getSatelliteName(item.platform)}${item.islocal ? ' (L)': ''}`;
                    }

                    const substredName = satelliteName.length > 14 ? satelliteName.substr(0, 12) + '..' : satelliteName;

                    return `<span title="${satelliteName}">${substredName}</span>`;
                },
                width: 100,
            },
            'cloudness': {
                type: 'float',
                name: Translations.getText('results.clouds'),
                sortable: true,
                formatter: item => {
                    let value = item.cloudness;
                    return value < 0 ? '' : Math.round (value);
                },
                default: 0,
                align: 'center',
                width: 55,
            },
            'tilt': {
                type: 'float',
                name: Translations.getText('results.angle'),
                sortable: true,
                formatter: item => {
                    let value = item.tilt;
                    return value < 0 ? '' : Math.round (value);
                },
                default: 0,
                align: 'center',
                width: 55,
            },
            'acqdate': {
                type: 'date',
                name: Translations.getText('results.date'),
                formatter: item => item.acqdate.toLocaleDateString(),
                sortable: true,
                width: 71,
            },                
            'info': {
                type: 'boolean',
                icon: 'search',
                yes: 'search-info-off',
                no: 'search-info-on',
                width: 26,
            },
            'cart': {
                tooltip: Translations.getText('results.cart'),
                columnIcon: 'cart-add cart-add-active',
                type: 'boolean',
                icon: 'cart-add',
                yes: 'cart-add-active',
                no: 'cart-add-passive',
                width: 22,
            },
        };

        this._grid = new ExtendedDataGrid(
            this._container,
            {
                application: this._application,
                fields: this.fields, 
                filter: item => Boolean (item.checked),
                sortBy: {field: 'acqdate', asc: false},
                indexBy: this._indexBy,
            }
        );
        this._grid.addEventListener('cell:click', this._onCellClick);
        this._grid.addEventListener('column:click', this._onColumnClick);
        this._grid.addEventListener('row:mouseover', this._onRowMouseOver);
        this._grid.addEventListener('row:mouseout', this._onRowMouseOut);
        this._grid.addEventListener('sort', this._onSort);

        this._grid._platformConstructor.addEventListener('changeClientFilter', (e) => this._onCLientFilterChange(e));
        this._grid._cloudnessConstructor.addEventListener('changeClientFilter', (e) => this._onCLientFilterChange(e));
        this._grid._angleConstructor.addEventListener('changeClientFilter', (e) => this._onCLientFilterChange(e));
        this._grid._acqdateConstructor.addEventListener('changeClientFilter', (e) => this._onCLientFilterChange(e));

        this._stopPropagation = this._stopPropagation.bind(this);
    }

    _onCLientFilterChange(e) {

        const {detail = {}} = e;

        let event = document.createEvent('Event');
        event.initEvent('changeClientFilter', false, false);
        event.detail = detail;
        this.dispatchEvent(event);
    }

    _stopPropagation (e) {
        e.stopPropagation();
    }
    
    resizeList() {

        const total = getPanelHeight(document.body.querySelector('.scanex-sidebar'), [ '.results-header' ]);

        this.resize(total);
        this.adjustWidth();
    }

    getItemByIndex (id) {
        return this._grid.getItemByIndex(id);
    }

    get fields () {
        return this._fields;
    }

    get sortBy() {

        return this._grid._sortBy;
    }

    _onSort (e) {
        let event = document.createEvent('Event');
        event.initEvent('sort', false, false);
        event.detail = this._grid.items;
        this.dispatchEvent(event);
    }

    _onCellClick (e){
        e.stopPropagation();
        let {row, cell, name, field, item} = e.detail;
        let event = document.createEvent('Event');
        let btn = null;
        let k = 0;

        switch(name){           
            case 'cart':
                /*btn = cell.querySelector('i');
                if (btn.classList.contains('cart-add-active')) {
                    btn.classList.remove('cart-add-active');
                    btn.classList.add('cart-add-passive');
                    item.cart = false;
                }
                else {
                    btn.classList.remove('cart-add-passive');
                    btn.classList.add('cart-add-active');
                    item.cart = true;                    
                }*/

                event.initEvent('addToCart', false, false);
                event.detail = item;
                this.dispatchEvent(event);
                break;
            case 'visible':                
                event.initEvent('setVisible', false, false);
                event.detail = item;
                this.dispatchEvent(event);
                break;
            case 'info':
                let {left, top} = cell.getBoundingClientRect();
                let button = cell.querySelector('i');

                if (this._activeInfo) {                    
                    this._activeInfo.classList.remove('search-info-off');
                    this._activeInfo.classList.add('search-info-on');
                }
                                
                this._activeInfo = button;
                                
                event.initEvent('showInfo', false, false);
                event.detail = {item: item, left, top, button};
                this.dispatchEvent(event);
                break;
            default:        
                // k = Object.keys(this._fields).indexOf('visible');
                // btn = row.querySelectorAll('td')[k].querySelector('i');
                // btn.classList.remove('search-visibility-on');
                // btn.classList.add('search-visibility-off');
                // // item.visible = 'visible';

                // event.initEvent('visible', false, false);
                // event.detail = item;
                // this.dispatchEvent(event);
                break;
        }
        switch (name) {
            case 'cart':
            case 'info':
            case 'visible':
                break;
            default:
                event.initEvent('click', false, false);
                event.detail = e.detail;
                this.dispatchEvent(event);
                break;
        }
    }
    _updateChecked (state) {
        let btn = this._grid.getCol('cart').querySelector('i');
        if (state) {                                                                   
            btn.classList.remove('cart-add-passive');
            btn.classList.add('cart-add-active');
        }
        else {
            btn.classList.remove('cart-add-active');
            btn.classList.add('cart-add-passive');
        }
    }
    _getChecked () {
        if (this._grid.items.length === 0) {
            return false;
        }
        let checked = false;
        if (this._grid.items.every(x => x.cart)) {
            checked = true;
        }
        else if (this._grid.items.every(x => !x.cart)) {
            checked = false;
        }        
        return checked;
    }
    _onColumnClick (e) {
        e.stopPropagation();
        let {col, field, name} = e.detail;
        let event = document.createEvent('Event');
        switch (name) {
            case 'cart':
                //let newItems = this._grid.items.filter(item => !item.cart);
                // let state = !this._getChecked();
                //let state = true;
                //if (newItems.length + window.Catalog.favoritesList.items.length <= window.MAX_CART_SIZE) {                    
                //    this._grid.items.forEach(item => {
                //        item.checked = state;                        
                //    });
                //    this._grid.refresh();

                    // this._updateChecked(state);

                    event.initEvent('addAllToCart', false, false);
                    event.detail = {};
                    this.dispatchEvent(event);
                //}
                //else {
                //    event.initEvent('cart:limit', false, false);                    
                //    this.dispatchEvent(event);
                //}                
                break;
            default:
                break;
        }
    }   
    _onRowMouseOver (e) {                
        if (!this._disableMouseHover) {
            let event = document.createEvent('Event');
            event.initEvent('mouseover', false, false);
            event.detail = e.detail;
            this.dispatchEvent(event);
        }        
    }
    _onRowMouseOut (e) {  
        if (!this._disableMouseHover) {              
            let event = document.createEvent('Event');
            event.initEvent('mouseout', false, false);
            event.detail = e.detail;
            this.dispatchEvent(event);
        }   
    }
    get indexBy () {
        return this._indexBy;
    }
    set items (value) {
        if(Array.isArray(value)) {            
            this._grid.items  = value;            
        }
    }
    get items() {
        return this._grid.items;
    }    
    hilite (id) {       
        let row = this._grid.getRow(id);
        if (row) {
            row.classList.add('hilite');
        }        
    }
    dim (id) {        
        let row = this._grid.getRow(id);
        if (row) {
            row.classList.remove('hilite');
        }        
    }    
    resize(total) {
        const height = this._container.querySelector('.table-list-header').getBoundingClientRect().height;
        this._container.querySelector('.table-list-body').style.maxHeight = `${total - height}px`;
    }
    refresh() {
        this._grid.refresh();        
        // this._updateChecked(this._getChecked());
        let event = document.createEvent('Event');
        event.initEvent('refreshed', false, false);
        this.dispatchEvent(event);
    }
    scrollToRow(id) {
        this._grid.scrollToRow(id);
    }
    enableFilter (enable) {
        this._grid.filtered = enable;
    }
    get filteredItems () {
        return this._grid.filteredItems;
    }
    get bbox () {
        return this._container.getBoundingClientRect();
    }
    adjustWidth () {
        this._grid.adjustHeader();
    }
    set filter (value) {
        this._grid.filter = value;
    }
    get count () {
        return this._grid.count;
    }
    getRow (rowId) {
        return this._grid.getRow (rowId);
    }
    redrawItem (id, item) {     
        this._disableMouseHover = true;
        this._grid.redrawRow(id, item);
        this._disableMouseHover = false;
    }
}

export default ResultList;