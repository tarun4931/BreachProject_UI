import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';

class PlaceOrders extends PolymerElement{
    static get properties(){
        return {
            stock:{
                type:Object
            },
            total:{
                type: String
            },
            reqBody:{
                type: Object
            }
        }
    }
    static get template(){
        return html `
            <style>
                .main{
                    width: 20%;
                    margin: 10px auto;
                    border: 2px solid #eee;
                }
                .main > div{
                    margin-top: 10px;
                }
                paper-dialog.colored {
                    border: 2px solid;
                    border-color: #4caf50;
                    background-color: #f1f8e9;
                    color: #4caf50;
                  }
            </style>
            <h1>place Orders</h1>
            <app-route route="{{route}}" pattern="/:id" data="{{routeData}}"></app-route>
            <iron-ajax
                    id="ajax"
                    url="https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=[[stock.stockName]]&apikey=CWIVW26D83LRESA9"
                    method="get"
                    on-response="handleResponse"
                    on-error="handleError"
                    handle-as="json"
                    content-type="application/json"></iron-ajax>
            <iron-ajax
                    id="postStock"
                    url="[[_getBuyUrl()]]"
                    method="POST"
                    body="[[reqBody]]"
                    on-response="buyStock"
                    on-error="handleError"
                    handle-as="json"
                    content-type="application/json"></iron-ajax>
            <div class="main">
                <div>
                    Stock Name: [[stock.stockName]]
                </div>
                <div>
                    <paper-input type="number" label="Quantity" placeholder="enter Quantity" value="{{stock.volume}}" min=1></paper-input>
                </div>
                <div>
                    Total: [[__getTotalAmount(stock.volume, stock.stockPrice)]]
                </div>
                <div>
                    <paper-button raised on-click="placeOrder">Place Order</paper-button>
                </div>
                <paper-dialog id="dialog">
                    <h2>Your Order is placed at Current Price [[total]]<h2>
                    <paper-button raised on-click="closeDialog">OK</paper-button>
                    <paper-button raised on-click="cancel">Cancel</paper-button>
                </paper-dialog>
            </div>
        `;
    }
    placeOrder(){
        this.$.ajax.generateRequest();
    }
    _getBuyUrl(){
        return config.baseUrl + '/orders'
    }
    cancel(){
        this.$.dialog.close();
    }
    __getTotalAmount(qty, amount){
        this.total = qty*amount;
        return qty*amount;
    }
    handleResponse(event){
        if(event.detail.response){
            let currentAmount = event.detail.response['Global Quote']['05. price'];
            this.__getTotalAmount(this.stock.volume, currentAmount);
            this.$.dialog.open();        
        }
    }
    closeDialog(){
        this.$.dialog.close();
        console.log(this.stock);
        this.dispatchEvent(new CustomEvent('renderReview', {bubbles: true, composed: true, detail:{'call': true}}));
        let request = {
            'stock': this.stock.stockName,
            'stockPrice': this.total,
            'trade_time': this.stock.trade_time,
            'volume': this.stock.volume
        }
        this.set('reqBody', request);
        this.$.postStock.generateRequest();        
    }
    buyStock(event){
        if(event.detail.response){
            this.set('route.path', '/review');
        }
    }
}

customElements.define('place-order', PlaceOrders);