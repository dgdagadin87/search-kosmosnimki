import Translations from 'scanex-translations';

import BaseCompositedComponent from '../../../../base/BaseCompositedComponent';

import ButtonComponent from './components/button/ButtonComponent';
import DialogComponent from './components/dialog/DialogComponent';

import {MAX_UPLOAD_OBJECTS, MAX_UPLOAD_POINTS} from '../../../../config/constants/constants';

import {getShapefileObject, getCoordinatesCount} from '../../../../utils/commonUtils';


export default class UploadComponent extends BaseCompositedComponent {

    init() {

        this.initChildren([
            {
                index: 'button',
                constructor: ButtonComponent
            },
            {
                index: 'dialog',
                constructor: DialogComponent
            }
        ]);

        this._bindEvents();
    }

    _bindEvents() {

        const buttonComponent = this.getChildComponent('button');
        const dialogComponent = this.getChildComponent('dialog');

        buttonComponent.events.on('click:show', this._onShowClick.bind(this));
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