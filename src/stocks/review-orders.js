import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '../components/orders-grid.js';
class ReviewOrders extends PolymerElement{
    connectedCallback(){
        super.connectedCallback();
        document.addEventListener('renderReview',(data) => {
            console.log(data);
            if(data.detail.call){
                this.$.ajax.generateRequest();
            }
        });
    }
    static get properties(){
        return {
            orders:{
                type: Array,
                value:[]   
            },
            baseURI:{
                type: String,
                value: baseUrl
            },
            loadingData:{
                type: Boolean,
                value: true
            }
        }
    }
    static get template(){
        return html `
            <h1>Review Orders</h1>
            <!-- <order-grid orders="[[orders]]" route="[[route]]"></order-grid> -->
            <iron-ajax
                    auto
                    id="ajax"
                    url="[[baseURI]]/orders"
                    method="get"
                    on-response="handleResponse"
                    on-error="handleError"
                    handle-as="json"
                    loading="{{loadingData}}"
                    content-type="application/json"></iron-ajax>
            <paper-spinner active="{{loadingData}}"></paper-spinner>
            <vaadin-grid id="gridData" aria-label="Tree Data Grid Example" items="[[orders]]">
                <vaadin-grid-column>
                    <template class="header">ID</template>
                    <template>
                        [[item.id]]
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">Name</template>
                    <template>
                        [[item.stockName]]
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">Price</template>
                    <template>
                        [[item.stockPrice]]
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">Trade Time</template>
                    <template>
                        [[item.tradeTime]]
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">Volume</template>
                    <template>
                        [[item.volume]]
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">Amount</template>
                    <template>
                        [[item.fees]]
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header"></template>
                    <template>
                        <paper-button raised on-click="placeOrder">Place Order</paper-button>
                    </template>
                </vaadin-grid-column>
            </vaadin-grid>
                
        `;
    }
    handleResponse(event){
        if(event.detail.response.length > 0){
            this.orders = event.detail.response;
        }
    }
    handleError(event){
        // if(event){

        // }
    }
    placeOrder(event){
        let stock = event.model.item;
        if(stock){
            this.dispatchEvent(new CustomEvent('stock', {bubbles:true, composed: true, detail:stock}));
            this.set('route.path', 'buy');
        }
    }
}

customElements.define('review-order', ReviewOrders);