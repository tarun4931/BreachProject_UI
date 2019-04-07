import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class MyOrders extends PolymerElement{
    static get template(){
        return html `
            <h1>My Orders</h1>
        `;
    }
}
customElements.define('mybkp-orders', MyOrders);