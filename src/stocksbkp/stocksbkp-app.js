import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class StocksBkp extends PolymerElement{
    static get template(){
        return html `
            <h1>Stock Details</h1>
        `;
    }
}
customElements.define('stocksbkp-app', StocksBkp);