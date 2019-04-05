import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
class PlaceOrders extends PolymerElement{
    connectedCallback(){
        super.connectedCallback();
        document.addEventListener('stock', (data) => {
            console.log('DATA - -',data.detail);
        });
        console.log(this.stock);
    }
    static get template(){
        return html `
            <h1>place Orders</h1>
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

customElements.define('place-order', PlaceOrders);