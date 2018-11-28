import Translations from 'scanex-translations';

import { LOCAL_STORAGE_KEY, DEFAULT_LANGUAGE } from 'js/config/constants/constants';
import { normalizeGeometryType } from 'js/utils/commonUtils';


class PermalinkManager {

    constructor (config) {

        const {application, name} = config;

        this._name = name;
        this._application = application;
    }

    globalApply() {

        const application = this.getApplication();
        const systemEvents = application.getAppEvents();

        this.applySavedStateToApplication();

        systemEvents.trigger('system:' + this._name + ':applied');
    }

    applySavedStateToApplication() {

        const localStorageState = this.getAppStateFromLocalStorage();

        if (localStorageState) {
            this._applyApplicationState(localStorageState);
        }
        else {

        }
    }

    saveAppStateToLocalStorage(data) {

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }

    getAppStateFromLocalStorage() {

        const rawState = localStorage.getItem(LOCAL_STORAGE_KEY);

        return JSON.parse(rawState);
    }

    removeAppStateFromLocalStorage() {

        localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    getPermalinkId() {

        return new Promise((resolve, reject) => { 

            const application = this.getApplication();
            const requestManager = application.getRequestManager();
            const currentState = this.getCurrentApplicationState();
            const content = JSON.stringify(currentState);

            requestManager.requestCreatePermalink({ content })
            .then(response => { 
                const {Status: status, Result: result} = response;
                if(status === 'ok'){
                    resolve(result);
                }
                else {
                    reject(response);
                }
            })
            .catch(e => reject(e));
        });
    }

    readPermalink (permalinlId) {

        return new Promise((resolve, reject) => { 
    
            const application = this.getApplication();
            const requestManager = application.getRequestManager();

            requestManager.requestReadPermalink({ id: permalinlId })
            .then(response => {
                const {Status: status, Result: result} = response;
                if (status == 'ok') {
                    try {                    
                        resolve(JSON.parse(result));
                    }
                    catch (e) {
                        reject(e);
                    }				        
                }
                else {
                    reject(response.Result);
                }
            })
            .catch(e => reject(e));
        });
    }

    getCurrentApplicationState() {

        const serialize = group => group.filter(s => s.checked).map(s => s.id);
        const application = this.getApplication();
        const map = application.getMap();
        const store = application.getStore();
        const center = map.getCenter();
        const {x, y} = L.Projection.Mercator.project(center);

        let searchCriteria = { ...store.getData('searchCriteria') };
        let {satellites: {ms, pc}} = searchCriteria;
        searchCriteria.satellites = { ms: serialize(ms), pc: serialize(pc) };

        let language = Translations.getLanguage();

        let drawings = store.getSerializedData('drawings');
        let drawingObjects = drawings.reduce ((prepared, {visible, id, color, name, area, geoJSON}) => {
            return prepared.concat({visible, id, color, name, area, geoJSON});
        }, []);

        let results = this._getNormalizedData('results');

        let favorites = this._getNormalizedData('favorites');

        let activeTabId = this._getCurrentTab();

        let cadastre = {};

        return {
            lang: language,
            drawingObjects,
            position: {
                x: x,
                y: y,
                z: 17 - map.getZoom()
            },
            activeLayer: map.gmxBaseLayersManager.getCurrentID(),        
            bounds: map.getBounds(),
            searchCriteria,
            items: results,
            cart: favorites,        
            activeTabId: activeTabId,
            cadastre: cadastre
        };
    }

    getApplication() {

        return this._application;
    }

    _applyApplicationState(state) {

        const application = this.getApplication();
        const store = application.getStore();
        const drawingController = application.getBridgeController('drawing');

        // remove from local storage
        this.removeAppStateFromLocalStorage();

        // language
        Translations.setLanguage (state.lang || DEFAULT_LANGUAGE);
        L.gmxLocale.setLanguage(state.lang || DEFAULT_LANGUAGE);

        // search criteria
        const searchCriteria = store.getData('searchCriteria');
        const stateCriteria = state['searchCriteria'];
        const {archive, date: [dateStart, dateEnd], annually, angle, clouds, stereo, satellites} = stateCriteria;

        const dates = [moment(dateStart).toDate(), moment(dateEnd).toDate()];

        const { satellites: {ms, pc} } = searchCriteria;
        ms.forEach(s => s.checked = (satellites.ms.indexOf(s.id) >= 0));
        pc.forEach(s => s.checked = (satellites.pc.indexOf(s.id) >= 0));

        store.rewriteData(
            'searchCriteria', {
                archive,
                date: dates,
                annually,
                angle,
                clouds,
                stereo,
                satellites: {ms, pc}
            }, ['searchCriteria:fullUpdate']
        );

        // drawings
        const {drawingObjects = []} = state;
        drawingController.addDrawingsOnListAndMapFromUploading(drawingObjects);
    }

    _getNormalizedData(dataKey) {

        const application = this.getApplication();
        const store = application.getStore();
        const suffix = dataKey === 'results' ? 'Results' : 'Favorites';

        const rawData = store['get'+suffix](dataKey, true);
        return rawData.map(item => {
            const {gmx_id: gmxId} = item;
            const unPreparedItem = store.getData('contours', gmxId);
            const {properties = []} = unPreparedItem;
            const rawGeoJson = properties[properties.length - 1];
            item.geoJSON = L.gmxUtil.convertGeometry (rawGeoJson, true, true);
            item.geoJSON = normalizeGeometryType(item.geoJSON);
            return item;
        });
    }

    _getCurrentTab() {

        const application = this.getApplication();
        const sidebarUiElement = application.getUiElement('sidebar');
        const sidebarView = sidebarUiElement.getView();

        return sidebarView.getCurrent();
    }

}

export default PermalinkManager;