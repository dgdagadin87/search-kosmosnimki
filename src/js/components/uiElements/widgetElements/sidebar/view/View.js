import SidebarControl from  'scanex-leaflet-sidebar';


export default class View {

    constructor({ map }) {

        this._main = new SidebarControl({position: 'topleft'});

        map.addControl(this._main);

        this._main.getContainer().classList.add('noselect');
        L.DomEvent.disableClickPropagation(this._main.getContainer());
        L.DomEvent.disableScrollPropagation(this._main.getContainer());/**/

        return this._main;
    }

}