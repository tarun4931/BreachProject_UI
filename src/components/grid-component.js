import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import { sharedStyle } from '../shared-style/shared-style.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-column.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import '@vaadin/vaadin-accordion/vaadin-accordion.js';
import '@polymer/paper-toast/paper-toast.js';
class GridComponent extends PolymerElement{

  connectedCallback(){
    super.connectedCallback();
  }

  static get properties(){
    return {
      users:{
        type: Array,
        value: []
      },
      allUsers:{
        type: Array,
        value:[]
      },
      pages:{
        type: Array,
        value: []
      },
      loadingData:{
        type: Boolean,
        value: true,
        observe:'__loadingChanged'
      },
      toastMessage:{
        type: String
      },
      pagination:{
        type: Boolean
      },
      stockName:{
        type: String
      },
      stockDetails:{
        type: Object
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
        .main{
          border: 2px solid #eee;
      }
      .main div{
          margin-left: 10px;
      }
      </style>
      <h1> All stocks</h1>
      <div class="container border">
        <template is="dom-if" if="[[loadingData]]">
          <div class="loading">Loading&#8230;</div>
        </template>
        <paper-toast id="toast" text="[[toastMessage]]" with-backdrop horizontal-align="center" vertical-align="middle"></paper-toast>
        <template is="dom-if" if="[[!loadingData]]">
          <vaadin-accordion>
            <template id="domRepeat" is="dom-repeat" items="[[allUsers]]" as="user">
                  <vaadin-accordion-panel>
                    <div slot="summary" on-click="getDetails">[[user.name]]</div>
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
                      <button class="btn btn-primary" on-click="getAnalytics">ONe Day Stocks</button>
                      <button class="btn btn-danger" on-click="getLastHour">last Stocks</button>
                      </div>
                    <div>
                    </vaadin-vertical-layout>
                  </vaadin-accordion-panel>
            </template>
            </vaadin-accordion>
          <template is="dom-if" if="[[pagination]]">
            <ul class="list-group list-group-horizontal d-flex justify-content-center mt-2">
              <template is="dom-repeat" items={{pages}}>
                <li class="list-group-item"> <a href="javascript:void(0);" on-click="paginateMe">{{item}}</a></li>
              </template>
            </ul>
          </template>
        </template>
      </div>
      <iron-ajax
            auto
            url="[[url]]"
            method="[[method]]"
            content-type="application/json"
            on-response="handleResponse"
            on-error="handleError"
            handle-as="json"
            loading="{{loadingData}}"
            >
      </iron-ajax>
      <iron-ajax
        id="ajax"
        url="[[_getStockURL(stockName)]]"
        method="get"
        on-response="handleStocks"
        on-error="handleError"
        handle-as="json"
        loading="{{loadingData}}"
        content-type="application/json"></iron-ajax>
      <iron-ajax
        id="hourAnalytics"
        url="[[_getLastHourUrl(stockName)]]"
        method="[[method]]"
        content-type="application/json"
        on-response="handleAnalytics"
        on-error="handleError"
        handle-as="json"
        loading="{{loadingData}}"
        > </iron-ajax>
    `
  }
  getAnalytics(){
    this.set('route.path', '/analytics');
  }
  getLastHour(){
    this.$.hourAnalytics.generateRequest();    
  }
  _getLastHourUrl(stockName){
    return config.baseUrl + '/hourstocks/' + stockName;
  }
  handleAnalytics(event){
    this.oneHourStock = event.detail.response.volume;
  }
  handleResponse(event){
    if(event.detail.response.length>0){
      this.allUsers = event.detail.response;
      this.users = event.detail.response;
      this.stockName = this.allUsers[0].name;
      this.$.ajax.generateRequest();
      if(this.pagination){
        this.paginate(this.allUsers.length, this.limit);
      }
    }else{
      this.toastMessage = "Users are not available";
    }
  }
  _getStockURL(stockName){
    return config.stockURL + "?function=GLOBAL_QUOTE&symbol="+ stockName +"&apikey=CWIVW26D83LRESA9";
  }
  handleError(event){
    if(event){
      this.toastMessage = "Unable to process the request";
      this.$.toast.open();
    }
  }
  handleStocks(event){
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
  getDetails(event){
    if(event.model.user){
      this.set('stockName',event.model.user.name);
      console.log(this.stockName);
      this.$.ajax.generateRequest();
    }
  }
  paginateMe(event){
    let index = event ? event.model.index : 0;
    let myUsers = [];
    let start = index * this.limit;
    for(let i=start; i<(this.limit+start); i++){
      myUsers.push(this.users[i]);
    }
    this.set('allUsers', myUsers);
  }

  clickMe(event){
    event.model.set('user.id', event.model.user.id+1)
  }


  paginate(length, limit){
    let totalPages = length/limit;
    let j = 0;
    let myPages = [];
    for(let i=0; i<totalPages; i++){
        myPages.push(i+1);
    }
    this.set('pages', myPages);
    this.paginateMe();
  }

}
customElements.define('grid-component', GridComponent);
