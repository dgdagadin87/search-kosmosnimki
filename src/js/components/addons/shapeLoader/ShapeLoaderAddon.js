import { copy } from 'scanex-object-extensions';
import { chain } from 'scanex-async';

import { SHAPE_LOADER_URL, META_DATA_URL, FILE_MAKE_URL, FILE_DOWNLOADER_URL, CSV_FILE_URL } from './constants.js'
import Formats from './Formats.js';


class ShapeLoader {

    constructor (config) {

        const {
            application,
            shapeLoaderUrl = SHAPE_LOADER_URL,
            metadataUrl = META_DATA_URL,
            fileMakerUrl = FILE_MAKE_URL,
            fileDownloaderUrl = FILE_DOWNLOADER_URL,
            csvFileUrl = CSV_FILE_URL
        } = config;

        this._application = application;

        this._csvColumns = ['sceneid', 'stereo', 'platform', 'cloudness', 'tilt', 'acqdate'];

        this._idLoaderUrl = `${location.href.substr(0, location.href.lastIndexOf('/'))}/SearchByID.ashx`;
        this._shapeLoaderUrl = shapeLoaderUrl;
        this._fileMakerUrl = fileMakerUrl;
        this._fileDownloaderUrl = fileDownloaderUrl;
        this._metadataUrl = metadataUrl;
        this._csvFileUrl = csvFileUrl;

        this._fileInput = null;
    }

    upload () {

        return new Promise ((resolve, reject) => {

            const fileInput = document.createElement('input');

            fileInput.setAttribute('type', 'file');

            document.body.appendChild(fileInput);

            this._fileInput = fileInput;

            fileInput.click();

            fileInput.addEventListener('change', () => this._inputChangeHandler(resolve, reject));
        });               
    }

    download (archiveName, type) {

        const application = this.getApplication();

        application.showLoader(true);

        const getMetaData = (state) => this._getMetaData(state, type);
        const createFile = (state) => this._createFile(state, archiveName, type);
        const downloadFile = (state) => this._downloadFile(state, archiveName, type);

        return chain([
            getMetaData,
            createFile,
            downloadFile
        ], {})
        .then(state => {            
            if (state.error) {
                console.log(state.error);
            }
        });        
    }

    getApplication() {

        return this._application;
    }

    _getMetaData(state, type) {

        return new Promise (resolve => {

            const csv = item => this._csvColumns.map(col => {
                return col === 'acqdate' ? moment(item[col]).format('YYYY-MM-DD') : item[col];
            });

            const application = this.getApplication();
            const requestManager = application.getRequestManager();
            const store = application.getStore();
            const downloadCache = store.getData('downloadCache') || [];
            let idsList = [];
            let itemsList = [];

            switch (type) {

                case 'results':
                    if(downloadCache && downloadCache.length > 0) {
                        idsList = downloadCache.map(item => `${item.sceneid};${item.platform};${item.islocal}`);
                    }
                    else {
                        const resultsList = store.getResults(true);
                        idsList = resultsList.map(item => `${item.sceneid};${item.platform};${item.islocal}`);
                    }
                    break;

                case 'rcsv':
                    if(downloadCache && downloadCache.length > 0) {
                        itemsList = downloadCache.map(csv);
                    }
                    else {
                        const resultsList = store.getResults(true);
                        itemsList = resultsList.map(csv);
                    }
                    break;

                case 'cart':
                case 'quicklooks':
                    if(downloadCache && downloadCache.length > 0) {
                        idsList = downloadCache.map(item => `${item.sceneid};${item.platform};${item.islocal}`);
                    }
                    else {
                        const favoritesList = store.getFavorites(true);
                        idsList = favoritesList.map(item => `${item.sceneid};${item.platform};${item.islocal}`);
                    }
                    break;

                case 'ccsv':
                    if(downloadCache && downloadCache.length > 0) {
                        itemsList = downloadCache.map(csv);
                    }
                    else {
                        const favoritesList = store.getFavorites(true);
                        itemsList = favoritesList.map(csv);
                    }
                    break;

                default:
                    break;

            }

            if (type === 'rcsv' || type === 'ccsv') {
                state.items = JSON.stringify (itemsList);
                resolve(state);
            }
            else {
                if (idsList.length > 0) {
                    requestManager.requestGetShapeMetadata(this._metadataUrl, {ids: idsList, WrapStyle: 'None'})
                    .then(response => {
                        if (response.Status === 'ok') {
                            state.result = response.Result;
                            resolve(state);
                        }
                        else {
                            state.error = response;
                            resolve(state);
                        }
                    })
                    .catch (e => {
                        state.error = e;
                        resolve(state);
                    });
                }
                else {
                    resolve(state);
                }
            }
        });
    }

    _createFile(state, archiveName, type) {

        return new Promise (resolve => {

            const application = this.getApplication();
            const requestManager = application.getRequestManager();
            const store = application.getStore();
            const drawings = store.getDrawings();

            if (type === 'rcsv' || type === 'ccsv') {
                resolve(state);
            }
            else {

                let Features = drawings
                .filter(item => item.visible)
                .map(({id, name, area, visible, editable, color, geoJSON}) => {                        
                    return {
                        type: 'Feature',
                        geometry: geoJSON.geometry,
                        properties: { id, name, area, visible, editable, color }
                    };
                });

                let Files = Features.length ? [{
                        Columns: [
                            {"Name":"id","Type":"String"},
                            {"Name":"name","Type":"String"},
                            {"Name":"area","Type":"Float"}, 
                            {"Name":"editable","Type":"Boolean"},
                            {"Name":"visible","Type":"Boolean"},
                            {"Name":"color","Type":"String"}
                        ],
                        Features,
                        Filename: `${archiveName}_contours`,
                        Formats: ['shape','tab'],
                    }] : [];

                switch (type) {

                    case 'results':
                    case 'cart':
                    case 'quicklooks':
                        let result = state.result;
                        Files = Files.concat (Object.keys (result).map(file => {
                            let Features = result[file].map(f => {
                                let properties = copy(f);
                                delete properties.geometry;
                                return {
                                    type: 'Feature',
                                    geometry: copy(f.geometry),
                                    properties
                                };
                            });
                            return {
                                Columns: Formats[file],
                                Filename: `${archiveName}_${file}`,
                                Features,
                                Formats: ['shape', 'tab']
                            };
                        }));
                        break;

                    default:
                        break;

                }
            
                const params = {
                    Request: JSON.stringify({
                        ArchiveName: archiveName,
                        Files,
                        Images: type === 'quicklooks'
                    })
                };

                requestManager.requestMakeFile(this._fileMakerUrl, params)
                .then(response => {
                    if (response.Status === 'ok'){
                        state.id = response.Result;
                        resolve(state);
                    }
                    else {
                        resolve(state);
                    }
                })
                .catch (e => {
                    state.error = e;
                    resolve(state);
                });

            }                
        });
    }

    _downloadFile(state, archiveName, type) {

        const application = this.getApplication();

        application.showLoader(false);

        return new Promise(resolve => {

            const requestManager = application.getRequestManager();

            if (type === 'rcsv' || type === 'ccsv') {

                const {items} = state;
                const params = {
                    items,
                    file: encodeURIComponent (archiveName),
                    columns: this._csvColumns, WrapStyle: 'None'
                };
                
                requestManager.requestDownloadCsvFile(this._csvFileUrl, params)
                .then(response => {
                    if (response.Status === 'ok') {
                        state.result = response.Result;
                        resolve(state);
                    }
                    else {
                        state.error = response;
                        resolve(state);
                    }                
                })
                .catch (e => {
                    state.error = e;
                    resolve(state);
                });
            }
            else {

                const url = `${this._fileDownloaderUrl}?id=${state.id}`;

                requestManager.requestDownloadCommonFile(url)
                .then(response => {
                    if (response.Status === 'ok'){
                        state.id = response.Result;
                        resolve(state);
                    }
                    else {
                        resolve(state);
                    }
                })
                .catch (e => {
                    state.error = e;
                    resolve(state);
                });
            }                
        });
    }

    _inputChangeHandler(resolve, reject) {

        const application = this.getApplication();
        const requestManager = application.getRequestManager();

        application.showLoader(true);

        let [file] = this._fileInput.files;

        if (file) {

            const formData = new FormData();

            formData.append('filename', file);
            formData.append('WrapStyle', 'None');

            requestManager.requestShapeLoader(this._shapeLoaderUrl, { method: 'POST', body: formData })
            .then (response => {
                this._removeFileInput();
                return response.json();
            })
            .then(response => {

                application.showLoader(false);

                const {Status: status, Result: result} = response;

                switch(status) {

                    case 'ok':
                        resolve({
                            type: 'shapefile',
                            results: result
                        });
                        break;

                    default:
                        requestManager.requestIdLoader(this._shapeLoaderUrl, { method: 'POST', body: formData })
                        .then (response => {
                            this._removeFileInput();
                            return response.json();
                        })
                        .then (response => {

                            const {Status: status, Result: result} = response;

                            if (status === 'ok') {
                                resolve({
                                    type: 'idlist',
                                    results: result
                                });
                            }
                            else {
                                reject(response);
                            }
                        })
                        .catch (e => {
                            this._removeFileInput();
                            reject(e);
                        });
                        break;
                }
            })
            .catch(e => {
                
                application.showLoader(false);

                this._removeFileInput();

                reject(e);
            });
        }
    }

    _removeFileInput() {

        if (this._fileInput) {
            this._fileInput.remove();
        }
        this._fileInput = null;
    }

}

export default ShapeLoader;