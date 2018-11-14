import Translations from 'scanex-translations';

import BaseCompositedComponent from '../../../../base/BaseCompositedComponent';

import ButtonComponent from './components/button/ButtonComponent';

import {MAX_UPLOAD_OBJECTS, MAX_UPLOAD_POINTS} from '../../../../config/constants/constants';

import {getShapefileObject, getCoordinatesCount} from '../../../../utils/commonUtils';


export default class UploadComponent extends BaseCompositedComponent {

    init() {

        this.initChildren([
            {
                index: 'button',
                constructor: ButtonComponent
            }
        ]);

        this._bindEvents();
    }

    _bindEvents() {

        const buttonComponent = this.getChildComponent('button');

        buttonComponent.events.on('click:show', this._onShowClick.bind(this));
    }

    _onShowClick() {

        const application = this.getApplication();
        const shapeLoader = application.getAddon('shapeLoader');

        shapeLoader.upload()
        .then((result) => this._uploadHandler(result))
        .catch((error) => this._errorHandler(error));
    }

    _uploadHandler({type, results}) {

        const application = this.getApplication();

        switch (type) {

            case 'shapefile':

                const objectsCount = results.length;
                const pointsCount = getCoordinatesCount(results);

                if (objectsCount <= MAX_UPLOAD_OBJECTS && pointsCount < MAX_UPLOAD_POINTS) {

                    let drawingsProperties = [];

                    results.forEach((item, key) => drawingsProperties.push(getShapefileObject(item, key)));

                    console.log(drawingsProperties);
                }
                else {

                    const errorText = `${Translations.getText('errors.upload')}<br />${Translations.getText('errors.points')}`;
                    application.showError(errorText);
                }

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