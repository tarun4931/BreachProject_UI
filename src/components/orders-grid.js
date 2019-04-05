import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';
import '@polymer/paper-button/paper-button.js';

class OrderGrid extends PolymerElement{
    static get template(){
        return html `
            <h1>Order Grid</h1>
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
    
    placeOrder(event){
        console.log(event.model.item, this.route.path);
        let stock = event.model.item;
        if(stock){
            console.log('DATATA - ');
            this.dispatchEvent(new CustomEvent('stock', {bubbles:true, composed: true, detail:stock}));
            this.set('route.path', 'buy');
        }
    }
}

customElements.define('order-grid', OrderGrid);