import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-input/paper-input.js';
import '../components/grid-component.js';

class AllOrders extends PolymerElement{
    constructor(){
        super();
        this.limit = 5;
        this.url = config.baseUrl + '/stocks';
        this.method = "GET";
        this.pagination = false;
    }
    static get properties(){
        return {
            allStocks:{
                type: Array,
                value: []
            },
            stockName:{
                type: Number,
                observer: 'getStockName'
            },
            qty:{
                type: Number,
                value:1,
                observer: 'calcPrice'
            },
            price:{
                type: Number,
                value: 0
            }
        }
    }
    
    getStockName(newVal, oldVal){
        this.$.ajax.generateRequest();
    }
    
    getStocks(stockName){
        return this.allStocks[stockName].name;
    }
    static get template(){
        return html `
            <style>
                .main{
                    width: 30%;
                    margin: 10px auto;
                    border: 2px solid #eee;
                }
                .main div{
                    margin-left: 10px;
                }
            </style>
            <grid-component limit="[[limit]]" url="[[url]]" method="[[method]]" route="{{route}}" pagination="[[pagination]]"></grid-component>
            
            <div class="">
                <!-- <div>
                    <paper-dropdown-menu label="Choose Stock">
                        <paper-listbox slot="dropdown-content" class="dropdown-content" attr-selected-for="name" selected="{{stockName}}">
                            <template is="dom-repeat" items="[[allStocks]]">
                                <paper-item name="[[item.name]]">[[item.name]]</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </div>
                <div>
                    <paper-input type="text" label="Price" placeholder="enter Price" value="{{price}}" min=1></paper-input>
                </div>
                <div>
                    <paper-input type="number" label="Quantity" placeholder="enter Quantity" value="{{qty}}" min=1></paper-input>
                </div>
                <div>
                    <paper-button raised on-click="placeOrder">Buy</paper-button>
                </div>
            </div> -->
        `;
    }
    calcPrice(newVal, oldVal){
        if(oldVal){
            this.price = this.currentPrice*this.qty;
        }
    }
    handleResponse(event){
        this.allStocks = event.detail.response;
    }
    handleError(){
        console.log(event);
    }
    placeOrder(event){
        if(stock){
            this.dispatchEvent(new CustomEvent('stock', {bubbles:true, composed: true, detail:stock}));
            this.set('route.path', 'buy');
        }
    }
    handleStocks(event){
        if(event.detail.response){
            this.currentPrice = event.detail.response['Global Quote']['05. price'];
            this.price = this.currentPrice * this.qty;
        }
    }
}

customElements.define('all-orders', AllOrders);