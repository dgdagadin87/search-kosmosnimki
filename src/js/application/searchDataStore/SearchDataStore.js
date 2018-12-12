import BaseDataStore from 'js/base/BaseDataStore';

import { LAYER_ATTRIBUTES, LAYER_ATTR_TYPES } from './Attributes';
import { fromGmx } from 'js/utils/commonUtils';


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

    return LAYER_ATTRIBUTES.indexOf(index) + 1;
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
        
        let attrKey = LAYER_ATTRIBUTES[index];
        
        switch (LAYER_ATTR_TYPES[index]){
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

export function getVisibleChangedState(show, properties) {

    const visibleIndex = getCorrectIndex('visible');
    const visibleValue = properties[visibleIndex];

    let changed = false;

    if (show) {
        switch(visibleValue) {
            case 'hidden':
            case 'failed':
                properties[visibleIndex] = 'loading';
                changed = true;
                break;
            case 'loading':
                properties[visibleIndex] = 'visible';
                changed = true;
                break;
            case 'visible':
            default:
                break;
        }
    }
    else {
        switch(properties[visibleIndex]) {
            case 'failed':
            case 'loading':
            case 'visible':
                properties[visibleIndex] = 'hidden';
                changed = true;
                break;
            case 'hidden':
            default:
                break;
        }
    }

    return changed;
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
            filterData: {
                unChecked = [],
                clouds = [0, 100],
                angle  = [0, 60],
                date   = [0, 0]
            },
        } = clientFilter;
        const resultIndex = getCorrectIndex('result');
        const cloudnessIndex = getCorrectIndex('cloudness');
        const angleIndex = getCorrectIndex('tilt');
        const cartIndex = getCorrectIndex('cart');
        const dateIndex = getCorrectIndex('acqdate');
        const platformIndex = getCorrectIndex('platform');

        const filteredData = contourItems.reduce((preparedData, item) => {

            const {properties} = item;
            const acqDate = typeof properties[dateIndex] === 'string' ? new Date(properties[dateIndex]) : new Date(properties[dateIndex] * 1000);
            const angleValue = Math.abs(properties[angleIndex]);

            const platformsCriteria = unChecked.indexOf(properties[platformIndex]) === -1;
            const cloudsCriteria = clouds[0] <= properties[cloudnessIndex] && properties[cloudnessIndex] <= clouds[1];
            const angleCriteria = angle[0] <= angleValue && angleValue <= angle[1];
            const dateCriteria = date[0].getTime() <= acqDate.getTime() && acqDate.getTime() <= date[1].getTime();

            if (properties[resultIndex] && (properties[cartIndex] || (cloudsCriteria && angleCriteria && dateCriteria && platformsCriteria)) ) {
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