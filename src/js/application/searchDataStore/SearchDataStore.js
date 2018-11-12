import BaseDataStore from '../base/BaseDataStore';

import { getCorrectIndex, propertiesToItem, fromGmx } from '../utils/commonUtils';


export default class SearchDataStore extends BaseDataStore {

    hasResults() {

        const snapshots = this.getSerializedData('snapshots');
        const resultIndex = getCorrectIndex('result');

        const hasResults = snapshots.some(item => {
            const {properties = []} = item;
            return properties[resultIndex];
        });

        return hasResults;
    }

    hasFavorites() {

        const snapshots = this.getSerializedData('snapshots');
        const cartIndex = getCorrectIndex('cart');

        const hasFavorites = snapshots.some(item => {
            const {properties = []} = item;
            return properties[cartIndex];
        });

        return hasFavorites;
    }

    hasSelectedFavorites() {

        const snapshots = this.getSerializedData('snapshots');
        const cartIndex = getCorrectIndex('cart');
        const selectedIndex = getCorrectIndex('selected');

        const hasFavorites = snapshots.some(item => {
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
        const snapshotItems = this.getSerializedData('snapshots');

        const filteredData = snapshotItems.reduce((preparedData, item) => {

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
        const snapshotItems = this.getSerializedData('snapshots');

        const filteredData = snapshotItems.reduce((preparedData, item) => {

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

    getDrawings() {

        return this.getSerializedData('drawings');
    }

    setDownloadCache(data) {

        if (Array.isArray[data] && data.length < 1) {
            this.rewriteData('downloadCache', []);
        }

        const {fields, values, types} = data;
        const downloadCache = fromGmx ({fields, values, types});

        this.rewriteData('downloadCache', downloadCache);
    }

}