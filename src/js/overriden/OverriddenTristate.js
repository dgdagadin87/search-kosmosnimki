class OverriddenTristate {
	constructor (target, items) {
		this._target = target;
		this._items = items;
		this._handleClick = this._handleClick.bind(this);
		this.update = this.update.bind(this);
		this._target.addEventListener('click', this._handleClick);
		this._attachEvents(this._items);
		this.state = this._items;
	}
	_handleClick () {
		let state = this._target.checked;
		for (let i = 0; i < this._items.length; ++i){
			let checked = this._items[i].checked;
			if (checked != state){
				//this._items[i].click();
			}
		}
	}
	_attachEvents(items) {		
		for (let i = 0; i < items.length; ++i){
			items[i].addEventListener('click', this.update);
		}
	}
	set state (items){		
		this._items = items;
		this._attachEvents(this._items);
		this.update();
	}
	get state () {
		let checked = this._items[0].checked;
		for (let i = 1; i < this._items.length; i++){
			if(this._items[i].checked != checked){				
				return { indeterminate: true };
			}
		}
		return { indeterminate: false, checked};
	}
	update () {
		if(this._items.length > 1) {
			const { indeterminate, checked } = this.state;
			this._target.indeterminate = indeterminate;
			if (!indeterminate) {
				this._target.checked = checked;
			}		
		}
	}
}

export default OverriddenTristate;