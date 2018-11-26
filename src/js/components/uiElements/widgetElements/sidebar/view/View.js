import SidebarControl from  'scanex-leaflet-sidebar';


export default class View {

    constructor({ map }) {

        this._main = new SidebarControl({position: 'topleft'});

        map.addControl(this._main);

        this._main.getContainer().classList.add('noselect');

        return this._main;
    }

}