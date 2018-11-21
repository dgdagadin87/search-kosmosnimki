import FloatingPanel from 'scanex-float-panel';
import Translations from 'scanex-translations';


class Cart extends FloatingPanel {
    constructor (container, {catalogResourceServer, left, top, userInfo, cols = 2, imageWidth = 250, imageHeight = 250, internal = true }) {
        super(container, {id: 'panel.cart', title: Translations.getText('cart.header'), left, top, modal: true});
        this._catalogResourceServer = catalogResourceServer;
        this._body.classList.add('cart');
        this._cols = cols;
        this._internal = internal;
        this._userInfo = userInfo;
        this._link = '//my.kosmosnimki.ru/Home/Settings';
        this._submit = this._submit.bind(this);
        this._imageWidth = imageWidth;
        this._imageHeight = imageHeight;
        this._items = [];
        this._permalink = '';
        this.hide();

        /*let dlgCartContainer = createContainer();
        dlgCartContainer.classList.add('cart-dialog');        
        this._dlgCart = new FloatingPanel(dlgCartContainer, { id: 'cart.dialog', left, top, modal: true });
        this._dlgCart.hide();
        this._dlgCart.content.innerHTML = 
        `<div>${Translations.getText('cart.success.header')}</div>
        <div>${Translations.getText('cart.success.content')}</div>
        <div>${Translations.getText('cart.success.footer')}</div>`;
        this._dlgCart.footer.innerHTML = `<button class="cart-close-button">${Translations.getText('cart.close')}</button>`;
        this._dlgCart.footer.querySelector('button').addEventListener('click', e => { this._dlgCart.hide(); });*/

        this._requiredFields =
        this._internal ? [
            '.cart-customer input', '.cart-project input', '.cart-project-number', '.cart-person input',
            '.cart-email input',
        ] : [
            '.cart-person input',
            '.cart-email input'
        ];
    }            
    get items () {
        return this._items;
    }
    set items (value) {
        this._items = value;
        this._view();
    }
    set permalink (value) {
        this._permalink = value;
    }
    get permalink () {
        return this._permalink;
    }     
    _view() {
        this._updateItemsNumber();
        const warning = Translations.getText('cart.warning').replace(/\r\n/, '<br />');
        const userInfo = this._userInfo;        
        this._content.innerHTML = `<div class="cart-order">
            <div class="cart-order-form">
                <div class="cart-order-warning">${warning}</div>
                <table>
                    <tbody>
                        <tr class="cart-customer">
                            <td>
                                <label>${Translations.getText('cart.customer')}</label>
                            </td>
                            <td>
                                <input type="text" value="" />
                            </td>
                            <td>${this._internal ? '*' : ''}</td>
                        </tr>
                        ${
                            this._internal ? 
                            `<tr class="cart-project">
                                <td>
                                    <label>${Translations.getText('cart.project.name')}</label>
                                </td>
                                <td>
                                    <input type="text" value="" />
                                </td>
                                <td>*</td>
                            </tr>
                            <tr class="cart-project-type">
                                <td>
                                    <label>${Translations.getText('cart.project.type.title')}</label>                                    
                                </td>
                                <td>
                                    <select>
                                        <option value="commercial">${Translations.getText('cart.project.type.commercial')}</option>
                                        <option value="internal">${Translations.getText('cart.project.type.internal')}</option>
                                        <option value="presale">${Translations.getText('cart.project.type.presale')}</option>
                                    </select>                                  
                                </td>
                                <td>*</td>
                            </tr>
                            <tr class="cart-project-number">
                                <td>
                                    <label>${Translations.getText('cart.project.number')}</label>
                                </td>
                                <td>
                                    <input type="text" class="cart-project-number" value="" />
                                </td>
                                <td>*</td>
                            </tr>` : ''
                        }
                        <tr class="cart-person">
                            <td>
                                <label>${Translations.getText('cart.person')}</label>
                            </td>
                            <td>
                                <input type="text" value="${userInfo.FullName}" />
                            </td>
                            <td>*</td>
                        </tr>
                        ${
                            this._internal ?
                            `<tr class="cart-company">
                                <td>
                                    <label>${Translations.getText('cart.company')}</label>
                                </td>
                                <td>
                                    <input type="text" readonly value="${userInfo.Organization}" />
                                </td>
                                <td></td>
                            </tr>` : ''
                        }
                        <tr class="cart-email">
                            <td>
                                <label>${Translations.getText('cart.email')}</label>
                            </td>
                            <td>
                                <input type="text" value="${userInfo.Email}" />
                            </td>
                            <td>*</td>
                        </tr>
                        <tr class="cart-comment">
                            <td>
                                <label>${Translations.getText('cart.comment')}</label>
                            </td>
                            <td>                            
                                <textarea maxlength="1000"></textarea>
                            </td>
                            <td>                                
                            </td>
                        </tr>                  
                    </tbody>
                </table>                
            </div>
            <div class="cart-order-footer">                
                <button class="cart-order-submit">${Translations.getText('cart.submit')}</button>
            </div>
        </div>`;     
        
        this._content.querySelector('.cart-order-warning .link').addEventListener('click', e => {
            let matches = /link=([^&]+)/g.exec(this.permalink);
            if (Array.isArray (matches) && matches.length > 0) {
                let [link,id,] = matches;
                read_permalink(id)
                .then (response => {                    
                    localStorage.setItem('view_state', JSON.stringify(response));    
                    window.location = this._link;
                })
                .catch(e => {
                    console.log(e);
                });
            }
            else {
                console.log('Permalink not set:', this._permalink);
            }
        });

        this._submitButton = this._content.querySelector('.cart-order-submit');        
        this._submitButton.addEventListener('click', this._submit);

        if (this._internal) {
            this._projectTypeSelect = this._content.querySelector('.cart-project-type select');            
            let update_project_number = () => {
                let field = this._content.querySelector('.cart-project-number')
                let input = field.querySelector('input');                
                let required = this._projectTypeSelect.value === 'commercial';
                input.readOnly = !required;
                field.querySelector('td:nth-child(3)').innerText = required ? '*' : '';
                if (input.readOnly) {
                    input.classList.add('read-only');
                }
                else {
                    input.classList.remove('read-only');
                }
            };
            update_project_number();
            this._projectTypeSelect.addEventListener('change', e => update_project_number());
        }        

        this.clear = this.clear.bind(this);        
                          
        this._requiredFields.forEach (s => {
            let el = this._container.querySelector(s === '.cart-project-number' ? s + ' input' : s);
            if (el) {
                el.addEventListener('focus', e => {                    
                    el.classList.remove('invalid-field');                    
                });
            }            
        });     
    }      
    get count () {
        return this.items.length;
    }
    _updateItemsNumber(){        
        let event = document.createEvent('Event');
        event.initEvent('items:change', false, false);
        event.detail = this.count;
        this.dispatchEvent(event);
    }   
    hide() {
        super.hide();        
        let event = document.createEvent('Event');
        event.initEvent('hide', false, false);
        this.dispatchEvent(event);
    }   
    show () {
        super.show();
        const bounds = document.body.getBoundingClientRect();
        let header = document.getElementById('header');
        const headerBounds = header.getBoundingClientRect();
        let height = bounds.height - headerBounds.height;
        let cartBounds = this.body.getBoundingClientRect();
        if (cartBounds.height > height) {
            const headerBounds = this.header.getBoundingClientRect();
            const footerBounds = this.footer.getBoundingClientRect();
            this.content.style.maxHeight = `${height - headerBounds.height - footerBounds.height}px`;
            this.content.style.overflowY = 'auto';
        }
        else {
            this.content.style.maxHeight = 'auto';
            this.content.style.overflowY = 'none';
        }
    }
    _valid (s) {        
        if (this._internal && s === '.cart-project-number') {            
            switch (this._projectTypeSelect.value) {
                case 'commercial':
                    let el = this._container.querySelector(s + ' input');
                    if (el && el.value.trim() === '') {
                        el.classList.add ('invalid-field');
                        return false;
                    }
                    else {
                        el.classList.remove ('invalid-field');
                        return true;
                    }
                case 'internal':                    
                case 'presale':
                    return true;
                default:
                    return false;
            }            
        }
        let el = this._container.querySelector(s);
        if (el && el.value.trim() === '') {
            el.classList.add ('invalid-field');
            return false;
        }
        else {
            el.classList.remove ('invalid-field');
            return true;
        }
    }
    _validate () {
        return this._requiredFields
        .map(this._valid.bind(this))
        .every(s => s);
    }
    _getProjectType (type) {
        switch (type) {
            case 'commercial':
                return 'К';
            case 'internal':
                return 'ВН';
            case 'presale':
                return 'ПС';
            default:
                throw 'unknown project type';
        }
    }
    _submit(){                        
        /*if (this._validate()) {
            this._catalogResourceServer.sendPostRequest('CreateOrder.ashx', {
                TinyReference: this.permalink,
                ReceiveWay: '',
                Customer: this._container.querySelector('.cart-customer input').value,
                Project: this._internal ? this._container.querySelector('.cart-project input').value : '',
                ProjectType: this._getProjectType(this._internal ?  this._container.querySelector('.cart-project-type select').value : 'commercial'),
                ContractNumber: this._internal ? this._container.querySelector('input.cart-project-number').value : '',
                Name: '',
                Surname: this._container.querySelector('.cart-person input').value,
                Organization: this._internal ? this._container.querySelector('.cart-company input').value : '',
                Email: this._container.querySelector('.cart-email input').value,
                Phone: '',
                Comment: this._container.querySelector('.cart-comment textarea').value,
                Scenes: this.items.map(item => item.sceneid).join(','),
                Internal: this._internal,
            })
            .then(response => {      
                this.hide();
                if (response.Status === 'ok') {                    
                    this._dlgCart.show();
                }
                else {
                    console.log(response);
                }
            })
            .catch(e => {
                this.hide();
                console.log(e)
            });
        }*/
        if (this._validate()) {
            const dataToSend = {
                TinyReference: this.permalink,
                ReceiveWay: '',
                Customer: this._container.querySelector('.cart-customer input').value,
                Project: this._internal ? this._container.querySelector('.cart-project input').value : '',
                ProjectType: this._getProjectType(this._internal ?  this._container.querySelector('.cart-project-type select').value : 'commercial'),
                ContractNumber: this._internal ? this._container.querySelector('input.cart-project-number').value : '',
                Name: '',
                Surname: this._container.querySelector('.cart-person input').value,
                Organization: this._internal ? this._container.querySelector('.cart-company input').value : '',
                Email: this._container.querySelector('.cart-email input').value,
                Phone: '',
                Comment: this._container.querySelector('.cart-comment textarea').value,
                Scenes: this.items.map(item => item.sceneid).join(','),
                Internal: this._internal,
            };

            let event = document.createEvent('Event');
            event.initEvent('submitOrder', false, false);
            event.data = dataToSend;
            this.dispatchEvent(event);
        }
    }
    clear () {
        this._items = [];
        this._view();
        this.hide();
    }
}

export default Cart;