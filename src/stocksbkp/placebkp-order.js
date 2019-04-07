import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
class PlaceOrders extends PolymerElement{
    connectedCallback(){
        super.connectedCallback();
        document.addEventListener('route', (data) => {
            console.log('DATA - -',data);
        });
	}

	static get properties() {
        return {
			route: {
				type: Object,
				reflectToAttribute: true,
				value: {}
			},
			selectedOrder: {
				type: Object,
				value:{}
			}
        }
    }
	
	static get observers() {
        return ['_routeSelectedOrderChanged(route.selectedOrder)']
    }

	_routeSelectedOrderChanged(selectedOrder) {
		if(selectedOrder) {
			this.selectedOrder = selectedOrder;
		}
	}

	
    static get template(){
        return html `
            <h1>Place Orders [[selectedOrder.id]]</h1>
            <iron-ajax
                    url=""
                    method=""
                    on-response="handleResponse"
                    on-error="handleError"
                    handle-as="json"
                    content-type="application/json"></iron-ajax>
            [[stock.stock_name]]
        `;
    }
}

customElements.define('placebkp-order', PlaceOrders);