import EventTarget from 'scanex-event-target';

import {LAYER_ID} from '../../../../../../../../../config/constants/constants';


class GmxLayerDataProvider extends EventTarget {

    constructor ({application, map}) {

        super();

        this.showSuggestion = false;
        this.showOnMap = false;
        this.showOnSelect = false;
        this.showOnEnter = true;

        this._application = application;
    }

    _toGeoJSON (fields, values) {

        return fields.reduce((a, k, i) => {
            if (k === 'geomixergeojson') {
                var geojson = L.gmxUtil.geometryToGeoJSON(values[i], true);
                a.geometry = geojson;
            }
            else {
                a.properties = a.properties || {};
                a.properties[k] = values[i];
            }
            return a;
        }, {type: 'Feature'});
    }

    fetch () {
    
        return new Promise(resolve => resolve([]));
    }

    find (value) {

        var query = value.split(/[\s,]+/).map(x => "(sceneid = '" + x + "')").join(' OR ');

        var application = this.getApplication();
        var requestManager = application.getRequestManager();

        return new Promise((resolve, reject) => {
            var rq = {
                layer: LAYER_ID,
                geometry: true,
                pagesize: 0,
                query: query,
                out_cs: 'EPSG:3857',
            };

            requestManager.requestVectorLayerSearch(rq)
                .then(response => {
                    if (response.Status == 'ok') {
                        var rs = response.Result.values.map(values => {
                            return {
                                feature: this._toGeoJSON(response.Result.fields, values),
                                provider: this,
                                query: value,
                            };
                        });
                        resolve(rs);

                        let event = document.createEvent('Event');
                        event.initEvent('fetch', false, false);
                        event.detail = response.Result;
                        this.dispatchEvent(event);
                    }
                    else {
                        reject(response.Result);
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    getApplication() {

        return this._application;
    }

}

export default GmxLayerDataProvider;