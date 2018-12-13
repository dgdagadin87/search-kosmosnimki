import { DataGrid } from 'scanex-datagrid';
import OverriddenTristate from './OverriddenTristate';


export default class OverriddenDataGrid extends DataGrid {

    _attachColumnsEvents() {
        if(this.hasItems) {
            const cols = this._header.querySelectorAll('td');
            const names = Object.keys(this._fields);
            for (let i = 0; i < cols.length; ++i){
                const name = names[i];                
                let field = this._fields[name];
                let col = cols[i];
                if(field.sortable) {
                    col.addEventListener('click', this._handleSort.bind(this, i));
                }
                if (field.type === 'selector') {
                    let ts = col.querySelector('.table-list-tristate');
                    //ts.addEventListener('click', this._stopPropagation);
                    let items = this._body.querySelectorAll(`td:nth-child(${i + 1}) input[type="checkbox"]`);
                    field.tristate = new OverriddenTristate(ts, items);
                }
                col.addEventListener('click', e => {
                    let event = document.createEvent('Event');
                    event.initEvent('column:click', false, false);
                    event.detail = {col, field, name};
                    this.dispatchEvent(event);
                });
            }
        }        
    }

}