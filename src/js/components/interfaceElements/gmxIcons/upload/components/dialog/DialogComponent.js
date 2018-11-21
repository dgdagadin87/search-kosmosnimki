import BaseComponent from 'js/base/BaseComponent';

import View from './view/View';


export default class UploadDialogComponent extends BaseComponent {

    init() {

        this._bindEvents();
    }

    _bindEvents() {

        this.events.on('apply', (data) => this.events.trigger('click:apply', data));
    }

    show(drawingProperties) {

        const {events} = this;

        new View({
            events,
            drawingProperties
        });
    }

}