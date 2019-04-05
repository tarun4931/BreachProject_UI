import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-ajax/iron-ajax.js';
class ReviewOrders extends PolymerElement{
    static get properties(){
        return {
            orders:{
                type: Array,
                value:[{
                    "id":1,
                    "stock_name":"Test 123",
                    "stock_price":120,
                    "volume":1,
                    "trade_time":"2018-02-03 05:34+GMT",
                    "fees":12
                }]   
            },
            baseURI:{
                type: String,
                value: baseUrl
            }
        }
    }
    static get template(){
        return html `
        [[baseURI]]
            <h1>Review Orders</h1>
            <iron-ajax
                    auto
                    url="[[baseURI]]/orders"
                    method="get"
                    on-response="handleResponse"
                    on-error="handleError"
                    handle-as="json"
                    content-type="application/json"></iron-ajax>
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
                        [[item.stock_name]]
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">Price</template>
                    <template>
                        [[item.stock_price]]
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template class="header">Trade Time</template>
                    <template>
                        [[item.trade_time]]
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
        console.log(event.detail.response);
    }
    placeOrder(event){
        let stock = event.model.item;
        if(event.model.item){
            this.dispatchEvent(new CustomEvent('stock', {bubbles:true, composed: true, detail:stock}));
            this.set('route.path', 'buy');
        }
    }
}

customElements.define('review-order', ReviewOrders);