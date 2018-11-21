import Translations from 'scanex-translations';

import BaseUIElement from 'js/base/BaseUIElement';

import DialogComponent from './components/dialog/DialogComponent';

import {MAX_UPLOAD_OBJECTS, MAX_UPLOAD_POINTS} from 'js/config/constants/constants';

import {getShapefileObject, getCoordinatesCount} from 'js/utils/commonUtils';


export default class UploadUIElement extends BaseUIElement {

    init() {

        const map = this.getMap();

        const uploadControl = new L.Control.gmxIcon({
            id: 'upload',
            position: 'searchControls',
            title: Translations.getText('controls.upload'),
            stateChange: this._onShowClick.bind(this)
        });

        this._view = uploadControl;

        map.gmxControlsManager.add(this._view);
        map.addControl(this._view);

        this.initChildren([
            {
                index: 'dialog',
                constructor: DialogComponent
            }
        ]);

        this._bindEvents();
    }

    _bindEvents() {

        const dialogComponent = this.getChildComponent('dialog');

        dialogComponent.events.on('click:apply', this._onApplyClick.bind(this));
    }

    _onShowClick() {

        const application = this.getApplication();
        const shapeLoader = application.getAddon('shapeLoader');

        shapeLoader.upload()
        .then((result) => this._uploadHandler(result))
        .catch((error) => this._errorHandler(error));
    }

    _onApplyClick(data) {

        const application = this.getApplication();
        const drawingController = application.getBridgeController('drawing');

        drawingController.addDrawingsOnListAndMapFromUploading(data);
    }

    _uploadHandler({type, results}) {

        const application = this.getApplication();
        const dialogComponent = this.getChildComponent('dialog');
        const contourController = application.getBridgeController('contour');

        switch (type) {

            case 'shapefile':
                const objectsCount = results.length;
                const pointsCount = getCoordinatesCount(results);

                if (objectsCount <= MAX_UPLOAD_OBJECTS && pointsCount < MAX_UPLOAD_POINTS) {

                    let drawingsProperties = [];

                    results.forEach((item, key) => drawingsProperties.push(getShapefileObject(item, key)));

                    dialogComponent.show(drawingsProperties);
                }
                else {

                    const errorText = `${Translations.getText('errors.upload')}<br />${Translations.getText('errors.points')}`;
                    application.showError(errorText);
                }
                break;

            case 'idlist':
                let {values, Count: count} = results;

                if (count){
                    const geometryIndex = values[0].length - 1;
                    values.forEach (item => {
                        item[geometryIndex] = L.gmxUtil.convertGeometry (item[geometryIndex], false, true);
                    });
                    contourController.clearSnapShotsOnResults();
                    contourController.addContoursOnMapAndList(results);
                }
                break;

            default:
                break;

        }
    }

    _errorHandler(e) {

        const application = this.getApplication();
        const errorText = e.toString();

        application.showError(errorText);

        window.console.error(e);
    }

}