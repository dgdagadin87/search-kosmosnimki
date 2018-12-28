import Tingle from 'tingle.js';

import BaseComponent from 'js/base/BaseComponent';

import Message from './Message.html';


export default class ModalComponent extends BaseComponent {

    init() {

        const modal = new Tingle.modal({
            footer: false,
            stickyFooter: false,
            closeMethods: []
        });

        modal.setContent('<div id="search-modal-container"></div>');

        this._modal = modal;
    }

    show(options = {}) {

        const {
            component = 'error',
            headerText = '',
            messageText = '',
            events = {},
            data = {}
        } = options;

        let contentParams = {};

        if (typeof component === 'string') {

            if (component === 'alert') {
                contentParams['mode'] = 'alert';
                contentParams['messageText'] = messageText;
            }
            else if (component === 'warning') {
                contentParams['mode'] = 'warning';
                contentParams['messageText'] = messageText;
            }
            else if (component === 'error') {
                contentParams['mode'] = 'error';
                contentParams['headerText'] = headerText;
                contentParams['messageText'] = messageText;
            }

            const content = new Message({
                target: this._getModalContainer(),
                data: contentParams
            });

            content.on('close', () => this.hide());

            this._content = content;
        }
        else {
            const content = new component({
                target: this._getModalContainer(),
                data
            });

            for (let index in events) {
                content.on(index, events[index]);
            }

            this._content = content;
        }

        this._modal.open();
    }

    hide() {

        if (this._content) {
            this._content.destroy();
        }

        this._content = null;

        this._modal.close();
    }

    _getModalContainer() {

        return document.querySelector('#search-modal-container');
    }

}