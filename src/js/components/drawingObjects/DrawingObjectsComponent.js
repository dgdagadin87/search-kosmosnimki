import BaseComponent from '../../base/BaseComponent';

import { DrawnObjectsControl } from './components/DrawnObjects';


export default class DrawingObjectsComponent extends BaseComponent {

    constructor(props) {

        super(props);

        this._component = new DrawnObjectsControl({position: 'topright'});

        this._bindEvents();
    }

    init() {

        const map = this.getMap();

        map.addControl(this._component);
    }

    _bindEvents() {

        const app = this.getApplication();
        const store = app.getStore();
        
        store.on('drawings:row:add:ui', () => {
            
            const drawingObjectsItems = store.getChangeableData(
                'drawings',
                { mode: 'full' }
            );
            const arr = Object.keys(drawingObjectsItems).map(id => drawingObjectsItems[id]);
            this._component.widget.items = arr;

            this._resizeWidget();
        });
    }

    _resizeWidget() {

        const app = this.getApplication();

        const { height } =  app.getMapContainer().getBoundingClientRect();
        this._component.widget.resize(height - 150);
    }

}