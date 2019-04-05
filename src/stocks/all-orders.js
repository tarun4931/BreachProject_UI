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

class AllOrders extends PolymerElement{
    static get properties(){
        return {
            allStocks:{
                type: Array,
                value: []
            },
            baseURI:{
                type:String,
                value: baseUrl
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
        console.log(this.allStocks);
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
            <h1>All Orders</h1>
    
            <iron-ajax
                    auto
                    url="[[baseURI]]/stocks"
                    method="get"
                    on-response="handleResponse"
                    on-error="handleError"
                    handle-as="json"
                    loading="{{loadingData}}"
                    content-type="application/json"></iron-ajax>
            <iron-ajax
                    id="ajax"
                    url="https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=[[getStocks(stockName)]]&apikey=CWIVW26D83LRESA9"
                    method="get"
                    on-response="handleStocks"
                    on-error="handleError"
                    handle-as="json"
                    loading="{{loadingData}}"
                    content-type="application/json"></iron-ajax>
           
            <paper-spinner active="{{loadingData}}"></paper-spinner>
            <div class="main">
                <div>
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
            </div>
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
        console.log(this.allStocks[this.stockName].name);
        console.log(this.qty);
        // let stock = {'stock'};
        if(stock){
            this.dispatchEvent(new CustomEvent('stock', {bubbles:true, composed: true, detail:stock}));
            this.set('route.path', 'buy');
        }
    }
    handleStocks(event){
        console.log(event.detail.response);
        if(event.detail.response){
            this.currentPrice = event.detail.response['Global Quote']['05. price'];
            this.price = this.currentPrice * this.qty;
        }
    }
}

customElements.define('all-orders', AllOrders);