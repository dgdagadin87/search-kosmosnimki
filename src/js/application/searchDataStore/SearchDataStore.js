import BaseDataStore from 'js/base/BaseDataStore';

import { CONTOUR_ITEM_ATTRIBUTES, CONTOUR_ITEM_ATTR_TYPES } from './Attributes';
import { fromGmx, prepareDate } from 'js/utils/commonUtils';


const fieldsList = [
    'x1',
    'gmx_id',
    'result',
    'cart',
    'visible',
    'hover',
    'selected',
    'acqdate',
    'tilt',
    'cloudness',
    'platform',
    'sceneid',
    'clip_coords'
];
let preparedIndexes = [];

fieldsList.forEach(field => {
    preparedIndexes[field] = getCorrectIndex(field);
});

export function getCorrectIndex(index) {

    return CONTOUR_ITEM_ATTRIBUTES.indexOf(index) + 1;
};

export function propertiesX1Slice(item) {

    const x1Index = getCorrectIndex('x1');
    const {properties = []} = item;

    return properties.slice(x1Index, x1Index + 8);
}

export function getProperty(item, fieldName) {

    const fieldIndex = preparedIndexes[fieldName];
    const {properties = []} = item;

    return properties[fieldIndex];
}

export function setProperty(item, data = {}) {

    const indexes = preparedIndexes;
    const {properties = []} = item;

    for (let key in data) {
        const currentValue = data[key];
        const fieldIndex = indexes[key];
        properties[fieldIndex] = currentValue;
    }

    item['properties'] = properties;

    return item;
}

export function propertiesToItem(properties) {

    if (!properties) {
        return null;
    }

    const lastPropertyIndex = properties ? properties.length - 1 : 0;

    return properties.slice(1, lastPropertyIndex).reduce((propertyObject, value, index) => {
        
        let attrKey = CONTOUR_ITEM_ATTRIBUTES[index];
        
        switch (CONTOUR_ITEM_ATTR_TYPES[index]){
            case 'date':
                if (typeof value === 'string') {
                    propertyObject[attrKey] = new Date(value);
                }
                else if (typeof value === 'number') {
                    propertyObject[attrKey] = new Date(value * 1000);
                }
                break;                
            default:
                propertyObject[attrKey] = value;
                break;
        }           
        return propertyObject;
    },{});
};

export function isVisibleChanged(item, show) {

    const visibleValue = getProperty(item, 'visible');

    let isChanged = false;

    if (show) {
        switch(visibleValue) {
            case 'hidden':
            case 'failed':
                isChanged = true;
                break;
            case 'loading':
                isChanged = true;
                break;
            case 'visible':
            default:
                break;
        }
    }
    else {
        switch(visibleValue) {
            case 'failed':
            case 'loading':
            case 'visible':
                isChanged = true;
                break;
            case 'hidden':
            default:
                break;
        }
    }

    return isChanged;
}

export function getChangedVisibleState(item, show) {

    let visibleValue = getProperty(item, 'visible');

    if (show) {
        switch(visibleValue) {
            case 'hidden':
            case 'failed':
                visibleValue = 'loading';
                break;
            case 'loading':
                visibleValue = 'visible';
                break;
            case 'visible':
            default:
                break;
        }
    }
    else {
        switch(visibleValue) {
            case 'failed':
            case 'loading':
            case 'visible':
                visibleValue = 'hidden';
                break;
            case 'hidden':
            default:
                break;
        }
    }

    return visibleValue;
};

export function mergeResults (old, data) {

    const resultIndex = getCorrectIndex('result');

    const cache = Object.keys(old).reduce((a,id) => {
        a[id] = a[id] || {properties: [], quicklook: null};
        a[id].properties = old[id].properties;
        return a;
    }, {});

    return data.reduce((a,value) => {
        const id = value[0];
        if (cache[id]){
            cache[id].properties[resultIndex] = true;
        }
        else {
            a[id] = a[id] || {properties: [], quicklook: null};
            a[id].properties = value;
        }
        return a;
    }, cache);
};

export function isClientFilterChanged(searchCriteria, clientFilter) {

    const {unChecked = []} = clientFilter;
    const {clouds: [criteriaMinCloud, criteriaMaxCloud]} = searchCriteria;
    const {clouds: [filterMinCloud, filterMaxCloud]} = clientFilter;
    const {angle: [criteriaMinAngle, criteriaMaxAngle]} = searchCriteria;
    const {angle: [filterMinAngle, filterMaxAngle]} = clientFilter;
    const {date: [criteriaMinDate, criteriaMaxDate]} = searchCriteria;
    const {date: [filterMinDate, filterMaxDate]} = clientFilter;

    if (unChecked.length > 0) {
        return true;
    }

    if (filterMinCloud !== criteriaMinCloud || filterMaxCloud !== criteriaMaxCloud) {
        return true;
    }

    if (filterMinAngle !== criteriaMinAngle || filterMaxAngle !== criteriaMaxAngle) {
        return true;
    }

    if (filterMinDate.getTime() !== criteriaMinDate.getTime() || filterMaxDate.getTime() !== criteriaMaxDate.getTime()) {
        return true;
    }

    return false;
}

export function createFilterConditions(item, isChanged, unChecked, clouds, angle, date) {

    const platformValue = getProperty(item, 'platform');
    const cloudValue = getProperty(item, 'cloudness');
    const tiltValue = getProperty(item, 'tilt');
    const dateValue = getProperty(item, 'acqdate');

    const acqDate = typeof dateValue === 'string' ? new Date(dateValue) : new Date(dateValue * 1000);
    const preparedDate = prepareDate(acqDate);
    const angleValue = Math.abs(tiltValue);

    const platformsCondition = unChecked.indexOf(platformValue) === -1;
    const cloudsCondition = isChanged ? (cloudValue > 0 ? clouds[0] <= cloudValue && cloudValue <= clouds[1] : true) : true;
    const angleCondition = isChanged ? (angle[0] <= angleValue && angleValue <= angle[1]) : true;
    const dateCondition = isChanged ? (date[0].getTime() <= preparedDate.getTime() && preparedDate.getTime() <= date[1].getTime()) : true;

    return platformsCondition && cloudsCondition && angleCondition && dateCondition;
}

export default class SearchDataStore extends BaseDataStore {

    hasResults() {

        const contours = this.getSerializedData('contours');
        const resultIndex = getCorrectIndex('result');

        const hasResults = contours.some(item => {
            const {properties = []} = item;
            return properties[resultIndex];
        });

        return hasResults;
    }

    hasFavorites() {

        const contours = this.getSerializedData('contours');
        const cartIndex = getCorrectIndex('cart');

        const hasFavorites = contours.some(item => {
            const {properties = []} = item;
            return properties[cartIndex];
        });

        return hasFavorites;
    }

    hasSelectedFavorites() {

        const contours = this.getSerializedData('contours');
        const cartIndex = getCorrectIndex('cart');
        const selectedIndex = getCorrectIndex('selected');

        const hasFavorites = contours.some(item => {
            const {properties = []} = item;
            return properties[cartIndex] && properties[selectedIndex];
        });

        return hasFavorites;
    }

    hasDrawings() {

        const drawings = this.getSerializedData('drawings');
        const hasDrawings = drawings.length > 0;

        return hasDrawings;
    }

    getResults(forGrid = false) {

        const resultIndex = getCorrectIndex('result');
        const contourItems = this.getSerializedData('contours');

        const filteredData = contourItems.reduce((preparedData, item) => {

            const {properties} = item;

            if (properties[resultIndex]) {
                if (forGrid) {
                    preparedData.push(propertiesToItem(properties));
                }
                else {
                    preparedData.push(item);
                }
            }
            
            return preparedData;
        }, []);

        return filteredData;
    }

    getFilteredResults(forGrid = false) {

        const contourItems = this.getSerializedData('contours');
        const clientFilter = this.getData('clientFilter');
        const {
            isChanged = false,
            filterData: {
                unChecked = [],
                clouds = [0, 100],
                angle  = [0, 60],
                date   = [0, 0]
            },
        } = clientFilter;
        const resultIndex = getCorrectIndex('result');
        const cartIndex = getCorrectIndex('cart');

        const filteredData = contourItems.reduce((preparedData, item) => {

            const {properties} = item;
            const isInFilterCriteria = createFilterConditions(item, isChanged, unChecked, clouds, angle, date);

            if (properties[resultIndex] && (properties[cartIndex] || isInFilterCriteria) ) {
                if (forGrid) {
                    preparedData.push(propertiesToItem(properties));
                }
                else {
                    preparedData.push(item);
                }
            }
            
            return preparedData;
        }, []);

        return filteredData;
    }

    getFavorites(forGrid = false) {

        const cartIndex = getCorrectIndex('cart');
        const contourItems = this.getSerializedData('contours');

        const filteredData = contourItems.reduce((preparedData, item) => {

            const {properties} = item;

            if (properties[cartIndex]) {
                if (forGrid) {
                    preparedData.push(propertiesToItem(properties));
                }
                else {
                    preparedData.push(item);
                }
            }
            
            return preparedData;
        }, []);

        return filteredData;
    }

    getSelectedFavorites() {

        const selectedIndex = getCorrectIndex('selected');
        const cartIndex = getCorrectIndex('cart');
        const contours = this.getSerializedData('contours');

        const selectedFavorites = contours.filter(item => {
            const {properties} = item;
            if (!properties) {
                return false;
            }
            if (properties[selectedIndex] && properties[cartIndex]) {
                return true;
            }
            return false;
        });

        return selectedFavorites;
    }

    getDrawings() {

        return this.getSerializedData('drawings');
    }

    setDownloadCache(data) {

        if (Array.isArray[data] && data.length < 1) {
            this.rewriteData('downloadCache', []);
        }

        const {fields, values, types} = data;
        const downloadCache = fromGmx({fields, values, types});

        this.rewriteData('downloadCache', downloadCache);
    }

    getMetaItem(key) {

        const metaData = this.getData('meta');
        
        return metaData[key] || null;
    }

    setMetaItem(key, value, events = []) {

        const metaData = this.getData('meta');
        const dataToRewrite = { ...metaData, [key]: value };
        
        this.rewriteData('meta', dataToRewrite, events);
    }

}