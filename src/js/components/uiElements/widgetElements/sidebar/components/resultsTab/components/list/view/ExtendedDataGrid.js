import { DataGrid } from 'scanex-datagrid';
import Platform from './Platform';
import Cloudness from './Cloudness';
import Angle from './Angle';
import AcqDate from './Data';


const sort = (items, field, asc) => {
    if (field) {
        return items
        .map((e, i) => { return {i: i, v: e}; })
        .sort((a, b) => {
            var left = a.v[field], right = b.v[field];

            if(left == null && right != null){
                return asc ? -1 : 1;
            }

            if(left != null && right == null){
                return asc ? 1 : -1;
            }

            if(typeof left == 'string') {
                left = left.toLowerCase();
            }

            if(typeof right == 'string') {
                right = right.toLowerCase();
            }

            if(left < right){
                return asc ? -1 : 1;
            }
            else if(left > right){
                return asc ? 1 : -1;
            }
            else if(left == right){
                var i = a.index, k = b.index;
                if(i < k){
                    return asc ? -1 : 1;
                }
                else if(i > k){
                    return asc ? 1 : -1;
                }
                else {
                    return 0;
                }
            }
        })
        .map(e => e.v);
    }
    else {
        return items;
    }
};

export default class ExtendedDataGrid extends DataGrid {

    constructor(...props) {

        super(...props);

        this._application = props[1]['application'];
        this._store = this._application.getStore();

        const {clouds, angle, date} = this._store.getData('searchCriteria');

        this._clientFilter = {
            satellites: [],
            clouds,
            angle,
            date
        };

        this._platformConstructor = new Platform({
            field: this._fields['platform'],
            setClientFilter: this._setSatellites.bind(this),
            closeAll: this._closeAllToggableContent.bind(this),
            application: this._application
        });
        this._cloudnessConstructor = new Cloudness({
            field: this._fields['cloudness'],
            setClientFilter: this._setCloudness.bind(this),
            closeAll: this._closeAllToggableContent.bind(this),
            application: this._application
        });
        this._angleConstructor = new Angle({
            field: this._fields['tilt'],
            setClientFilter: this._setAngle.bind(this),
            closeAll: this._closeAllToggableContent.bind(this),
            application: this._application
        });
        this._acqdateConstructor = new AcqDate({
            field: this._fields['acqdate'],
            setClientFilter: this._setDate.bind(this),
            closeAll: this._closeAllToggableContent.bind(this),
            application: this._application
        });

        this._platformConstructor.addEventListener('clientFilter:apply', () => {
            
            let event = document.createEvent('Event');
            event.initEvent('clientFilter:apply', false, false);
            this.dispatchEvent(event);
        });
        this._cloudnessConstructor.addEventListener('clientFilter:apply', () => {
            
            let event = document.createEvent('Event');
            event.initEvent('clientFilter:apply', false, false);
            this.dispatchEvent(event);
        });
        this._angleConstructor.addEventListener('clientFilter:apply', () => {
            
            let event = document.createEvent('Event');
            event.initEvent('clientFilter:apply', false, false);
            this.dispatchEvent(event);
        });
        this._acqdateConstructor.addEventListener('clientFilter:apply', () => {
            
            let event = document.createEvent('Event');
            event.initEvent('clientFilter:apply', false, false);
            this.dispatchEvent(event);
        });
    }

    _closeAllToggableContent(name) {

        const header = this._header;

        const filterableHeaders = header.querySelectorAll('.filterable-header');
        filterableHeaders.forEach(item => {
            if (!item.classList.contains(`filterable-header-${name}`)) {
                item.classList.remove('active');
            }
        });

        const toggableContents = header.querySelectorAll('.togglable-content');
        toggableContents.forEach(item => {
            if (!item.classList.contains(`togglable-content-${name}`)) {
                item.style.visibility = 'hidden';
            }
        });
    }

    clearFilter() {

        const {criteria: {clouds, angle, date}} = window.Catalog.searchOptions;

        this._sortBy = {field: 'acqdate', asc: false};

        this._clientFilter = {
            satellites: this._platformConstructor.prepareSatellites(true),
            clouds, angle, date
        };

        this._platformConstructor.renderHeader(true);
        this._cloudnessConstructor.renderHeader(true);
        this._angleConstructor.renderHeader(true);
        this._acqdateConstructor.renderHeader(true);

        const event = document.createEvent('Event');
        event.initEvent('clientFilter:apply', false, false);
        this.dispatchEvent(event);
    }

    get unChecked() {

        return this._platformConstructor.unChecked;
    }

    get clientFilter() {

        return this._clientFilter;
    }

    _setClearButtonVisible() {

        const clientFilter = this.clientFilter;
        const {criteria} = window.Catalog.searchOptions;

        let platformIsModified = false;
        if (this.unChecked.length > 0) {
            platformIsModified = true;
        }

        let cloudnessIsModified = false;
        const [minClientCloudness, maxClientCloudness] = clientFilter.clouds;
        const [minCriteriaCloudness, maxCriteriaCloudness] = criteria.clouds;
        if (minClientCloudness !== minCriteriaCloudness || maxClientCloudness !== maxCriteriaCloudness) {
            cloudnessIsModified = true;
        }

        let angleIsModified = false;
        const [minClientAngle, maxClientAngle] = clientFilter.angle;
        const [minCriteriaAngle, maxCriteriaAngle] = criteria.angle;
        if (minClientAngle !== minCriteriaAngle || maxClientAngle !== maxCriteriaAngle) {
            angleIsModified = true;
        }

        let dateIsModified = false;
        const [minClientDate, maxClientDate] = clientFilter.date;
        const [minCriteriaDate, maxCriteriaDate] = criteria.date;
        if (minClientDate.getTime() !== minCriteriaDate.getTime() || maxClientDate.getTime() !== maxCriteriaDate.getTime()) {
            dateIsModified = true;
        }

        const displayStyle = platformIsModified || cloudnessIsModified || angleIsModified || dateIsModified ? 'inline' : 'none';

        window.Catalog.resultsContainer.querySelector('.results-clear-filter').style.display = displayStyle;
    }

    _renderRow (item) {

        const itemClass = item.cart ? ' class="cart-in-result"' : '';

        if (typeof this._filter !== 'function' || !this._filtered || this._filter (item)) {
            let idx = null;
            if (Array.isArray (this._indexBy) && this._indexBy.length > 0 && this._indexBy.every(k => item.hasOwnProperty(k))) {
                let values = this._indexBy.map(k => item[k]);
                idx = get_hash (values);
            }
            else if (typeof this._indexBy === 'string' && item.hasOwnProperty(this._indexBy)) {
                idx = item[this._indexBy];
            }
            else {
                idx = item[ENUM_ID];
            }
            return `<tr${itemClass} data-item-id="${idx}">${Object.keys(this._fields).map(this._renderCell.bind(this, item)).join('')}</tr>`;
        }
    }

    _renderCell (item, col) {
        const field = this._fields[col];
        const width = field.width;
        const padding = col === 'platform' ? 'padding-right:0;' : '';
        const align = this._align ? ` style="text-align: ${field.align || this._getCellAlign(field.type)};${padding}"` : '';  
        switch(field.type) {
            case 'selector':
                return Boolean(item[col]) ? `<td${align}><input type="checkbox" checked value="${col}" /></td>` : `<td${align}><input type="checkbox" value="${col}" /></td>`;
            case 'button':
                return `<td${align}><i class="table-list-button ${field.button}" /></td>`;
            case 'boolean':
                let val = typeof field.formatter === 'function' ? field.formatter (item) : item[col];
                const cell = (field.yes || field.no) ? `<i class="table-list-button ${field.icon} ${val ? (field.yes || '') : (field.no || '')}"></i>` : `${val ? '+' : ''}`;
                return `<td${align}>${cell}</td>`;
            case 'color':
                return `<td${align}>
                        <div class="table-list-color" style="${ typeof item[col] !== 'undefined' ? `border-color: ${item[col]}` : 'border: none'} ">&nbsp;</div>
                    </td>`;
            default:                
                if (typeof field.styler === 'function') {                    
                    return `<td${align}><i class="${field.styler(item)}"></i></td>`;
                }
                else {
                    let val = typeof field.formatter === 'function' ? field.formatter (item) : item[col];
                    return `<td${align}><span>${val}</span>${field.edit ? '<i class="cell-edit"></i>' :''}</td>`;
                }
                
        }
    }

    _setSatellites(satellites) {

        //this._setClearButtonVisible();

        this._clientFilter['satellites'] = satellites;
    }

    _setCloudness(clouds) {

        //this._setClearButtonVisible();

        this._clientFilter['clouds'] = clouds;
    }

    _setAngle(angle) {

        //this._setClearButtonVisible();

        this._clientFilter['angle'] = angle;
    }

    _setDate(date) {

        //this._setClearButtonVisible();

        this._clientFilter['date'] = date;
    }

    _initWidgets(init = true) {

        this._cloudnessConstructor.initSlider(init);
        this._angleConstructor.initSlider(init);
        this._acqdateConstructor.initDatePicker();
        this._acqdateConstructor.initSlider(init);
    }

    _render (items) {
        this._renderHeader();
        this._renderBody(items);
        this.adjustHeader();
        this._updateSelector();
        this._attachColumnsEvents();
        this._initWidgets();
    }

    _reorder(i, name, asc) {
        this._updateColumns(i, asc);
        this._renderBody (sort(this.items, name, asc));
        this.adjustHeader();
        this._updateSelector();
        this._initWidgets(false);
    }

    _renderHeaderColumn(col) {

        const field = this._fields[col];
        let el = '';

        if (col === 'platform') {

            return (
                `<td style="padding-left:0;" ${field.tooltip ? ` title="${field.tooltip}"` : ''} class="table-list-col" data-field="${col}">
                   ${this._platformConstructor.renderHeader()}
                </td>`
            );
        }

        if (col === 'cloudness') {

            return (
                `<td style="padding-left:3px;" ${field.tooltip ? ` title="${field.tooltip}"` : ''} class="table-list-col" data-field="${col}">
                   ${this._cloudnessConstructor.renderHeader()}
                </td>`
            );
        }

        if (col === 'tilt') {

            return (
                `<td style="padding-left:4px;" ${field.tooltip ? ` title="${field.tooltip}"` : ''} class="table-list-col" data-field="${col}">
                   ${this._angleConstructor.renderHeader()}
                </td>`
            );
        }

        if (col === 'acqdate') {

            return (
                `<td style="padding-left:10px;" ${field.tooltip ? ` title="${field.tooltip}"` : ''} class="table-list-col" data-field="${col}">
                   ${this._acqdateConstructor.renderHeader()}
                </td>`
            );
        }

        switch(field.type) {
            case 'selector':
                el = `<input class="table-list-tristate" type="checkbox" />`;
                break;
            case 'boolean':
            case 'string':
                if (typeof field.name === 'string') {
                    el = `<span>${field.name}</span>`;
                }
                else if (typeof field.columnIcon === 'string') {
                    el = `<i class="${field.columnIcon}"></i>`;
                }
                break;
            case 'button':
                if (typeof field.columnIcon === 'string') {
                    el = `<i class="${field.columnIcon}"></i>`;
                }
                else if (typeof field.name === 'string') {
                    el = `<span>${field.name}</span>`;
                }
                break;
            default:
                if (typeof field.name === 'string') {
                    el = `<span>${field.name}</span>`;
                }
                break;
        }
        return `<td${field.tooltip ? ` title="${field.tooltip}"` : ''} class="table-list-col" data-field="${col}" style="padding-top:20px;">
            ${el}
            <i class="table-list-sort"${field.sortable ? '' : ' style="display: none"'}></i>
        </td>`;
    }

    _attachColumnsEvents() {
        //if(this.hasItems) {
            const cols = this._header.querySelectorAll('td');
            const names = Object.keys(this._fields);
            for (let i = 0; i < cols.length; ++i){
                const name = names[i];                
                let field = this._fields[name];
                let col = cols[i];

                if(field.sortable) {
                    if (name === 'platform') {
                        const sortIcon  = col.querySelector('.table-list-sort');
                        sortIcon.addEventListener('click', this._handleSort.bind(this, i));
                        this._platformConstructor.attachEvents(col);
                    }
                    else if (name === 'cloudness') {
                        const sortIcon  = col.querySelector('.table-list-sort');
                        sortIcon.addEventListener('click', this._handleSort.bind(this, i));
                        this._cloudnessConstructor.attachEvents(col);
                    }
                    else if (name === 'tilt') {
                        const sortIcon  = col.querySelector('.table-list-sort');
                        sortIcon.addEventListener('click', this._handleSort.bind(this, i));
                        this._angleConstructor.attachEvents(col);
                    }
                    else if (name === 'acqdate') {
                        const sortIcon  = col.querySelector('.table-list-sort');
                        sortIcon.addEventListener('click', this._handleSort.bind(this, i));
                        this._acqdateConstructor.attachEvents(col);
                    }
                    else {
                        col.addEventListener('click', this._handleSort.bind(this, i));
                    }
                }
                if (field.type === 'selector') {
                    let ts = col.querySelector('.table-list-tristate');
                    ts.addEventListener('click', this._stopPropagation);
                    let items = this._body.querySelectorAll(`td:nth-child(${i + 1}) input[type="checkbox"]`);
                    console.log(items);
                    field.tristate = new Tristate(ts, items);
                }
                col.addEventListener('click', e => {
                    let event = document.createEvent('Event');
                    event.initEvent('column:click', false, false);
                    event.detail = {col, field, name};
                    this.dispatchEvent(event);
                });
            }
        //}        
    }

}