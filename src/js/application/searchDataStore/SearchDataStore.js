import BaseDataStore from 'js/base/BaseDataStore';

import { getCorrectIndex, propertiesToItem, fromGmx } from 'js/utils/commonUtils';


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