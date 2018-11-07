import BaseCompositedComponent from '../../../../base/BaseCompositedComponent';

import ButtonComponent from './components/button/ButtonComponent';


export default class DownloadComponent extends BaseCompositedComponent {

    init() {

        const preparedConfig = { ...this.getConfig(), parent: this };

        this._buttonComponent = new ButtonComponent(preparedConfig);

        this._buttonComponent.init();
    }

}