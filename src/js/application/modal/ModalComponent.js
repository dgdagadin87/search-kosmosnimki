import Tingle from 'tingle.js';

import BaseComponent from 'js/base/BaseComponent';

import Message from './Message.html';


export default class ModalComponent extends BaseComponent {

    init() {

        const modal = new Tingle.modal({
            footer: false,
            stickyFooter: false,
            closeMethods: [],
            onClose: function() {
                console.log('modal closed');
            },
        });

        modal.setContent('<div id="search-modal-container"></div>');

        this._modal = modal;
    }

    show(options = {}) {

        const { component = 'error',  headerText = '', messageText = '' } = options;

        if (typeof component === 'string') {

            let contentParams = {};

            if (component === 'error') {
                contentParams['mode'] = 'error';
                contentParams['headerText'] = headerText;
                contentParams['messageText'] = messageText;
            }

            const content = new Message({
                target: this._getModalContainer()
            });

            content.on('close', () => this.hide());

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