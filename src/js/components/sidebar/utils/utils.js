import { satellites } from '../../../config/satellites/satellites';

import { getCorrectIndex } from '../../../utils/commonUtils';


function createDefaultCriteria() {

    const setSatellitesChecked = (group, flag) => {
        for (let key in group) {      
            let s = group[key];
            s.checked = flag;
        }
    };

    const now = new Date();

    const dateStart = new Date(now.getFullYear(), 0, 1);
    const dateEnd = now;

    setSatellitesChecked(satellites.ms, true);
    setSatellitesChecked(satellites.pc, true);

    const defaultCriteria = {
        date: [ dateStart, dateEnd ],
        annually: false,
        clouds: [0, 100],
        angle: [0, 60],
        resolution: [0.3, 20],
        satellites: satellites,
        stereo: false,
    };

    return defaultCriteria;
}

function manageTabsState(sidebar, store, state) {

    const resultIndex = getCorrectIndex('result');
    const cartIndex = getCorrectIndex('cart');

    const allSnapShots = store.getSerializedData('contours');

    const hasResultData = allSnapShots.some(item => {
        const {properties} = item;
        if (properties) {
            return properties[resultIndex];
        }
    });

    const hasFavoritesData = allSnapShots.some(item => {
        const {properties} = item;
        if (properties) {
            return properties[cartIndex];
        }
    });

    if (state === 'start') {

        sidebar.disable('results');
        sidebar.disable('favorites');

        return;
    }

    if (state === 'stopDrawing') {

        if (!sidebar.getCurrent()) {               
            sidebar.setCurrent('search');
        }

        return;
    }

    if (state === 'clearResults') {

        sidebar.disable('results');
        sidebar.setCurrent('search');

        return;
    }

    if (state === 'addToResults') {

        if (hasResultData) {
            sidebar.enable('results');
            sidebar.setCurrent('results');
        }
        else {
            sidebar.disable('results');
            sidebar.setCurrent('search');
        }

        return;
    }

    if (state === 'addToFavorites') {

        if (hasFavoritesData > 0) {
            sidebar.enable('favorites');
        }
        else {
            sidebar.disable('favorites');
            sidebar.setCurrent('results');
        }

        return;
    }

    if (state === 'clearFavorites') {

        if (hasFavoritesData) {
            sidebar.enable('favorites');
            sidebar.setCurrent('favorites');
        }
        else {
            sidebar.disable('favorites');
            hasResultData ? sidebar.setCurrent('results') : sidebar.setCurrent('search');
        }

        return;
    }
}

export { createDefaultCriteria, manageTabsState };