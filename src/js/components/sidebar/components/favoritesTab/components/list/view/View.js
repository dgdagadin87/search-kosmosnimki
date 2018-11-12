import EventTarget from 'scanex-event-target';

import { DataGrid } from 'scanex-datagrid';

import Translations from 'scanex-translations';
import { getSatelliteName } from '../../../../../../../utils/commonUtils';


class FavoritesList extends EventTarget {
    constructor(container, { restricted }) {
        super();
        this._cart = {};
        this._restricted = restricted;
        this._container = container;
        this._container.classList.add('favorites-list');             
        this._onCellClick = this._onCellClick.bind(this);
        this._onColumnClick = this._onColumnClick.bind(this);
        this._onRowMouseOver = this._onRowMouseOver.bind(this);
        this._onRowMouseOut = this._onRowMouseOut.bind(this);
        this._onSort = this._onSort.bind(this);
        this._activeInfo = null;
        this._disableMouseHover = false;
        this._indexBy = 'gmx_id';
        this._fields = {  
            'selected': {
                type: 'selector',
                default: false,
            },           
            'visible': {                
                type: 'string',                    
                columnIcon: 'search search-visibility-off',
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
                formatter: (item) =>  {                    
                    switch(item.platform) {
                        case 'SPOT6':                        
                        case 'SPOT 6':
                            return item.islocal ? 'SPOT 6' : 'SPOT 6 (A)';
                        case 'SPOT7':
                        case 'SPOT 7':
                            return item.islocal ? 'SPOT 7' : 'SPOT 7 (A)';
                        case 'SPOT-6':
                            return item.product ? 'SPOT 6 (P)' : 'SPOT 6';
                        case 'SPOT-7':
                            return item.product ? 'SPOT 7 (P)' : 'SPOT 7';
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
                            return `${sp5}${item.islocal ? '' : ' (A)'}`;
                        case 'Ресурс-П1':
                        case 'Ресурс-П2':
                        case 'Ресурс-П3':
                            if (item.spot5_a_exists && !item.spot5_b_exists) {
                                return `${item.platform} pan`;
                            }
                            else if (item.spot5_b_exists) {
                                return `${item.platform} ms`;
                            }
                            else {
                                return item.platform;
                            }    
                        case 'GF1':
                            switch (item.sensor) {
                                case 'A':
                                    return 'GaoFen-1 (2m)';
                                case 'B':
                                    return 'GaoFen-1 (16m)';
                                default:
                                    return 'GaoFen-1';
                            }
                        case '1A-PHR-1A':
                            return '1ATLAS (PHR-1A)';
                        case '1A-PHR-1B':
                            return '1ATLAS (PHR-1B)';
                        case '1A-SPOT-6':
                            return '1ATLAS (SP6)';
                        case '1A-SPOT-7':
                            return '1ATLAS (SP7)';
                        case 'TripleSat Constellation-1':
                            return 'Triplesat-1';
                        case 'TripleSat Constellation-2':
                            return 'Triplesat-2';
                        case 'TripleSat Constellation-3':
                            return 'Triplesat-3';
                            case 'GJ1A':
                            return 'Superview-1 01';
                        case 'GJ1B':
                            return 'Superview-1 02';
                        case 'GJ1C':
                            return 'Superview-1 03';
                        case 'GJ1D':
                            return 'Superview-1 04';
                        default:
                            return `${getSatelliteName(item.platform)}${item.islocal ? ' (L)': ''}`;
                    }
                },
            },
            'cloudness': {
                type: 'float',
                name: Translations.getText('results.clouds'),
                sortable: true,
                formatter: item => Math.round (item.cloudness),
                default: 0,
                align: 'center',
            },
            'tilt': {
                type: 'float',
                name: Translations.getText('results.angle'),
                sortable: true,
                formatter: item => Math.round (item.tilt),
                default: 0,
                align: 'center',
            },
            'acqdate': {
                type: 'date',
                name: Translations.getText('results.date'),
                formatter: item => item.acqdate.toLocaleDateString(),
                sortable: true,
            },                
            'info': {
                type: 'boolean',
                icon: 'search',
                yes: 'search-info-off',
                no: 'search-info-on',
            },
            
        };

        this._grid = new DataGrid(            
            this._container,
            {
                fields: this.fields,
                sortBy: {field: 'acqdate', asc: false},
                indexBy: this._indexBy,
            }
        );
        this._grid.addEventListener('cell:click', this._onCellClick);        
        this._grid.addEventListener('column:click', this._onColumnClick);
        this._grid.addEventListener('row:mouseover', this._onRowMouseOver);
        this._grid.addEventListener('row:mouseout', this._onRowMouseOut);
        this._grid.addEventListener('sort', this._onSort);
        this._stopPropagation = this._stopPropagation.bind(this);        
    }

    _onSort (e) {
        let event = document.createEvent('Event');
        event.initEvent('sort', false, false);
        event.detail = this._grid.items;
        this.dispatchEvent(event);
    }

    _stopPropagation (e) {
        e.stopPropagation();
    } 

    getItemByIndex (id) {
        return this._grid.getItemByIndex(id);
    }

    get fields () {
        return this._fields;
    }    
    _onCellClick (e){
        e.stopPropagation();
        let {i, j, row, cell, name, field, item} = e.detail;
        let event = document.createEvent('Event');
        let btn = null;
        let k = 0;

        switch(name){           
            case 'selected':
                item.selected = Boolean(cell.querySelector('input[type=checkbox]').checked);
                event.initEvent('setSelected', false, false);
                event.detail = item;
                this.dispatchEvent(event);
                break;
            case 'visible':               
                event.initEvent('showVisible', false, false);
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
                k = Object.keys(this._fields).indexOf('visible');
                btn = row.querySelectorAll('td')[k].querySelector('i');
                btn.classList.remove('search-visibility-on');
                btn.classList.add('search-visibility-off');
                item.visible = true;

                event.initEvent('visible', false, false);
                event.detail = item;
                this.dispatchEvent(event);
                break;
        }
        switch (name) {
            case 'selected':
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
    _onColumnClick (e) {
        e.stopPropagation();
        let {col, field, name} = e.detail;
        let event = document.createEvent('Event');     
        switch (name) {
            case 'selected':
                e.preventDefault();
                event.initEvent('setAllSelected', false, false);
                this.dispatchEvent(event);
                break;
            case 'visible':
                let state = false;
                if (this._grid.items.every(x => x.visible !== 'hidden')) {
                    state = false;
                }
                else if (this._grid.items.every(x => x.visible === 'hidden')) {
                    state = true;
                }
                else {
                    state = col.querySelector('i').classList.contains('favorites-select-quicklooks-active');
                }                
                let btn = this._grid.getCol(name).querySelector('i');
                if (state) {                   
                    btn.classList.add('favorites-select-quicklooks-passive');
                    btn.classList.remove('favorites-select-quicklooks-active');
                }
                else {
                    btn.classList.add('favorites-select-quicklooks-active');
                    btn.classList.remove('favorites-select-quicklooks-passive');
                }
                event.initEvent('visible:all', false, false);
                event.detail = state;
                this.dispatchEvent(event);
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
        let height = this._container.querySelector('.table-list-header').getBoundingClientRect().height;
        let body = this._container.querySelector('.table-list-body');
        body.style.maxHeight = `${total - height}px`;
        body.style.height = body.style.maxHeight;
    }
    refresh() {
        this._grid.refresh();
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

export default FavoritesList;