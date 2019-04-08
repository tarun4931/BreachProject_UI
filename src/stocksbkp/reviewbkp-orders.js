import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-filter-column.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-ajax/iron-ajax.js';
class ReviewOrdersBkp extends PolymerElement {
    static get properties() {
        return {
            orders: {
                type: Array,
                value: []
            },
			route: {
				type: Object,
				reflectToAttribute: true,
				value: {}
			},
			selectedOrder: {
				type: Object,
				reflectToAttribute: true,
				value: {}
			}
        }
    }
	
    _getReviewsURL() {
    	return config.baseUrl+"/orders"; 
    }
    
    placeOrder(event,elem) {
		var selectedOrder = this.orders.filter((e)=>{return e.id==event.target.id});
		console.log(selectedOrder[0]);
		if(selectedOrder.length>0) {
			this.set('route.selectedOrder',selectedOrder[0]);
		}
		this.set('route.path', 'buy');
	}
    
	static get template() {
        return html`
        <style>
            
        </style>
            <iron-ajax
                    id="dataAjax"
                    auto
                    url="[[_getReviewsURL()]]"
                    method="get"
                    on-response="handleResponse"
                    on-error="handleError"
                    handle-as="json"
                    content-type="application/json"></iron-ajax>
            <vaadin-grid id="gridData" aria-label="Tree Data Grid Example" items="[[orders]]" column-reordering-allowed multi-sort>
                <vaadin-grid-column header="ID">
                    <template>
                        [[item.id]]
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-filter-column path="stockName" header="Stock name">
                    <template>
                        [[item.stockName]]
                    </template>
                </vaadin-grid-filter-column>
                <vaadin-grid-column header="Price">
                    <template>
                        [[item.stockPrice]]
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column header="Trade Time">
                    <template>
                        [[item.tradeTime]]
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column header="Volume">
                    <template>
                        [[item.volume]]
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column header="Amount">
                    <template>
                        [[item.fees]]
                    </template>
                </vaadin-grid-column>
                <vaadin-grid-column>
                    <template>
                        <paper-button id="[[item.id]]" raised class="indigo" on-tap="placeOrder">Place Order</paper-button>
                    </template>
                </vaadin-grid-column>
            </vaadin-grid>
                
        `;
    }
    handleResponse(event) {
        this.orders = event.detail.response;
    }
}
customElements.define('reviewbkp-order', ReviewOrdersBkp);