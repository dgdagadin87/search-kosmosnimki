import EventTarget from 'scanex-event-target';



export default class PlatformFilter extends EventTarget {

    constructor(config) {

        super();

        const {field, setClientFilter, closeAll, application} = config;

        this._application = application;
        this._field = field;
        this._setClientFilter = setClientFilter;
        this._closeAll = closeAll;

        this._unChecked = [];
        this._tmpUnchecked = [];
    }

    get unChecked() {

        return this._unChecked;
    }

    _getSortBy() {

        const app = this._application;
        const sidebar = app.getUiElement('sidebar');
        const resultList = sidebar.getChildComponent('resultsTab.list');
        const view = resultList.getView();

        return view['sortBy'];
    }

    renderHeader(clear = false) {

        const sortBy = this._getSortBy();

        if (clear) {
            this._unChecked = [];
            this._tmpUnchecked = [];
        }
        else {
            this._tmpUnchecked = [...this._unChecked];
        }

        this.prepareSatellites();

        const appliedDisplay = this._unChecked.length > 0 ? 'block' : 'none';
        const appliedClass = this._unChecked.length > 0 ? ' applied' : '';
        const sortIconDisplay = sortBy['field'] === 'platform' ? ''  : ' style="visibility: hidden"';

        let platformsCount = 0;
        this._satellites.forEach(satellite => {
            const {platforms} = satellite;
            platformsCount += platforms.length;
        });

        return (
            `<div class="filterable-field-container">
                <div class="on-hover-div">
                    <div class="filterable-applied">
                        <div style="display: ${appliedDisplay};">
                            <span class="checked">${platformsCount - this._unChecked.length}</span>/<span class="all">${platformsCount}</span>
                        </div>
                    </div>
                    <span class="filterable-header-platform filterable-header${appliedClass}">${this._field['name']}</span>
                    <i class="table-list-sort"${sortIconDisplay}></i>
                </div>
                <div style="visibility: hidden;" class="togglable-content-platform togglable-content filterable-satellites-container">
                    <fieldset class="search-options-satellites-ms">
                        ${this._getSatelliteList(this._satellites)}
                    </fieldset>
                    <div class="apply">Применить</div>
                </div>
            </div>`
        );
    }

    attachEvents(column) {

        const filterableHeader = column.querySelector('.filterable-header');
        const satelliteCheckboxes = column.querySelectorAll('input[type="checkbox"]');
        const applyButton = column.querySelector('.apply');

        this._container = column;

        column.querySelector('.on-hover-div').addEventListener('mouseover', this._onSortMouseOver.bind(this));
        column.querySelector('.on-hover-div').addEventListener('mouseout', this._onSortMouseOut.bind(this));
        filterableHeader.addEventListener('click', this._onColumnClick.bind(this));
        applyButton.addEventListener('click', this._onApplyClick.bind(this));
        
        satelliteCheckboxes.forEach(item => {
            item.addEventListener('click', this._onCheckboxClick.bind(this));
        })
    }

    prepareSatellites(forReturn = false) {

        this._satellites = [];

        const {satellites} = this._application.getStore().getData('searchCriteria');

        satellites.ms.forEach(item => {
            item.checked && this._satellites.push(item);
        });
        satellites.pc.forEach(item => {
            item.checked && this._satellites.push(item);
        });

        this._setClientFilter(this._satellites);

        if (forReturn) {
            return this._satellites;
        }
    }

    _getSatelliteList(cache) {

        cache.sort((first, second) => {
            if(first['_name'] < second['_name']) {
                return -1;
            }
            if(first['_name'] > second['_name']) {
                return 1;
            }
            return 0;
        });

        return cache.map((x) => {
            const {id, name,platforms} = x;
            const isInUnchecked = platforms.some(platform => this._unChecked.indexOf(platform) !== -1 );
            const checkedParam = !isInUnchecked ? 'checked="checked"' : '';
            return `<div class="satellite-col">
                        <input ${checkedParam} type="checkbox" id="sat_${id}" value="${id}" />
                        <label for="sat_${id}">${name}</label>
                    </div>`;
        }).join('');
    }

    _onColumnClick(e) {

        this._closeAll('platform');

        const {target} = e;

        if (target) {
            const hasActiveClass = target.classList.contains('active');
            const parentNode = target.parentNode.parentNode;
            const filterContainer = parentNode.querySelector('.togglable-content');

            if (!hasActiveClass) {
                target.classList.add('active');
                filterContainer.style.visibility = 'visible';
            }
            else {
                target.classList.remove('active');
                filterContainer.style.visibility = 'hidden';
                this._tmpUnchecked = [...this._unChecked];
                const satellitesContainer = this._container.querySelector('.search-options-satellites-ms');
                satellitesContainer.innerHTML = this._getSatelliteList(this._satellites);
                const satelliteCheckboxes = this._container.querySelectorAll('input[type="checkbox"]');
                satelliteCheckboxes.forEach(item => {
                    item.addEventListener('click', this._onCheckboxClick.bind(this));
                });
            }
        }
    }

    _onSortMouseOver(e) {

        const sortBy = this._getSortBy();

        if (sortBy['field'] === 'platform') {
            return;
        }

        const {target} = e;

        if (target) {
            let sortIcon = target.querySelector('i');
            if (!sortIcon) {
                sortIcon = target.parentNode.querySelector('i');
            }

            const sortIconType = sortBy['field'] === 'platform' ? sortBy['asc'] ? 'up' : 'down' : sortBy['asc'] ? 'down' : 'up';
            const sortIconClass = 'table-list-sort-' + sortIconType;

            if (sortIcon) {
                sortIcon.classList.add(sortIconClass);
                sortIcon.style.visibility = 'visible';
            }
        }
    }

    _onSortMouseOut(e) {

        const sortBy = this._getSortBy();

        if (sortBy['field'] === 'platform') {
            return;
        }

        const {target} = e;

        if (target) {
            let sortIcon = target.querySelector('i');
            if (!sortIcon) {
                sortIcon = target.parentNode.querySelector('i');
            }

            if (sortIcon) {
                sortIcon.style.visibility = 'hidden';
            }
        }
    }

    _onCheckboxClick(e) {

        const {target} = e;
        const {checked, id} = target;

        const idArray = id.split(/sat_/);
        const correctId = idArray[1];

        const currentPlatforms = this._getSatellitePlatformsById(correctId);

        currentPlatforms.forEach(platform => {
            const unCheckedIndex = this._tmpUnchecked.indexOf(platform);
            if (!checked) {
                if (unCheckedIndex === -1) {
                    this._tmpUnchecked.push(platform);
                }
            }
            else {
                this._tmpUnchecked.splice(platform, 1);
            }
        });
    }

    _onApplyClick(e) {

        const {target} = e;
        const parent = target.parentNode.parentNode;
        const filterableHeader = parent.querySelector('.filterable-header');
        const togglableContent = parent.querySelector('.togglable-content');
        const filterableApplied = parent.querySelector('.filterable-applied > div');

        this._unChecked = [...this._tmpUnchecked];

        filterableHeader.classList.remove('active');

        if (this._unChecked.length > 0) {
            filterableHeader.classList.add('applied');
            filterableApplied.style.display = 'block';
            filterableApplied.querySelector('.checked').innerText = (this._satellites.length - this._unChecked.length);
            filterableApplied.querySelector('.all').innerText = this._satellites.length;
        }
        else {
            filterableHeader.classList.remove('applied');
            filterableApplied.style.display = 'none';
        }

        togglableContent.style.visibility = 'hidden';

        let newSatellites = [];

        this._satellites.forEach(item => {
            const {platforms} = item;
            const arePlatformsInUnchecked = platforms.some(platform => this._unChecked.indexOf(platform) !== -1);
            if (!arePlatformsInUnchecked) {
                newSatellites.push(item);
            }
        });

        this._setClientFilter(newSatellites);

        let event = document.createEvent('Event');
        event.initEvent('clientFilter:apply', false, false);
        this.dispatchEvent(event);
    }

    _getSatellitePlatformsById(satelliteId) {

        const currentSatellite = this._satellites.filter(item => item['_id'] === satelliteId);
        
        return currentSatellite[0]['_platforms'];
    }

}