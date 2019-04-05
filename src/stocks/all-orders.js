import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class AllOrders extends PolymerElement{
    static get template(){
        return html `
            <h1>All Orders</h1>
        `;
    }
}

customElements.define('all-orders', AllOrders);