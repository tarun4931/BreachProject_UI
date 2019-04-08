import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import { sharedStyle } from '../shared-style/shared-style.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@vaadin/vaadin-accordion/vaadin-accordion.js';
import '@polymer/paper-toast/paper-toast.js';

class StocksBkp extends PolymerElement{
	
	static get properties(){
	    return {
          allStocks:{
	        type: Array,
	        value:[],
			reflectToAttribute: true
	      },
	      toastMessage:{
	        type: String
	      },
		  route: {
			type: Object,
			reflectToAttribute: true,
			value: {}
		  },
	      stockDetails:{
	        type: Object,
	        value: {}
	      },
	      stockURL : {
	    	  type: String,
	    	  value: ""
	      }
	    }
	  }
	
	getStockDetails(event) {
		this.stockDetails = {};
		this.stockDetails.name = event.target.innerText;
		this._getStockURL();
		this.$.ajax.generateRequest();
	}
	
	_getStockURL(){
	    this.stockURL = config.stockURL + "/query?function=GLOBAL_QUOTE&symbol="+ this.stockDetails.name +"&apikey=CWIVW26D83LRESA9";
	}
	
	handleStock(event){
	    if(event.detail.response){
	      let stock = event.detail.response['Global Quote'];
	      try{
		        this.stockDetails = {
		          "name": stock["01. symbol"],
		          "open": stock["02. open"],
		          "high": stock["03. high"],
		          "low": stock["04. low"],
		          "price": stock["05. price"]
		        }
	      }
	      catch(e){
		        this.set('stockDetails',{});
		        this.toastMessage = "Unable to process the request";
		        this.$.toast.open();
	      }	      
	    }
	}
	
    static get template(){
        return html `
        ${sharedStyle}
        <style>
        	  :host{
          		color: var(--myColor);
		       }
		       .btn {
		       		font-family: sans-serif;
		       }
		        .main{
		          border: 2px solid #eee;
		      	}
		      	.main div{
		          margin-left: 10px;
		      	}
      </style>
      <paper-toast id="toast" text="[[toastMessage]]" with-backdrop horizontal-align="center" vertical-align="middle"></paper-toast>
      <vaadin-accordion>
            <template id="domRepeat" is="dom-repeat" items="[[route.allStocks]]" as="stock">
                  <vaadin-accordion-panel>
                    <div slot="summary" id="[[stock.name]]" on-tap="getStockDetails">[[stock.name]]</div>
                    <vaadin-vertical-layout>
                    <div class="col-sm-12 main">
                      <div class="form-group">
                        <label for="name">Stock Name: </label>
                        [[stockDetails.name]]
                      </div>
                      <div class="form-group">
                        <label for="name">Stock Open Price: </label>
                        [[stockDetails.open]]
                      </div>
                      <div class="form-group">
                        <label for="name">Stock high Price: </label>
                        [[stockDetails.high]]
                      </div>
                      <div class="form-group">
                        <label for="name">Stock Low Price: </label>
                        [[stockDetails.low]]
                      </div>
                      <div class="form-group">
                        <label for="name">Last Traded Price: </label>
                        [[stockDetails.price]]
                      </div>
                      <div class="form-group">
                        <label for="name">Last OneHour Price: </label>
                        [[oneHourStock]]
                      </div>
                      <div class="form-group">
                      <button class="btn btn-primary" on-click="getAnalytics">One Day Stocks</button>
                      <button class="btn btn-danger" on-click="getLastHour">Last One Hour Stock</button>
                      <button class="btn btn-success" on-click="buyStock">Buy stocks</button>
                      </div>
                    <div>
                    </vaadin-vertical-layout>
                  </vaadin-accordion-panel>
            </template>
            </vaadin-accordion>
            <iron-ajax
        		id="ajax"
        		url="[[stockURL]]"
        		method="get"
        		on-response="handleStock"
        		on-error="handleError"
        		handle-as="json"
        		content-type="application/json"></iron-ajax>
      `;
    }
}
customElements.define('stocksbkp-app', StocksBkp);