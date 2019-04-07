import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
/**
 * @customElement
 * @polymer
 */
class MainApp extends PolymerElement {
  ready(){
    super.ready();
    document.addEventListener('stock', (data) => {
      this.stockData = data.detail;
    })
  }
  static get properties() {
    return {
        page: {
            type: String,
            reflectToAttribute: true,
            observer: '_pageChanged'
        },
        stockData:{
          type: Object
        }
    }
}

static get observers() {
    return ['_routeChanged(routeData.page)']
}

_routeChanged(page) {
    this.page = page || 'stocks';
}

_pageChanged(currentPage, oldPage) {
    switch (currentPage) {
        case 'review':
            import('../stocks/review-orders.js');
            break;
        case 'buy':
            import('../stocks/place-order.js');
            break;
        case 'stocks':
            import('../stocks/all-orders.js');
            break;
        default:
            this.page = 'stocks';
    }
}
  static get template() {
    return html`
    <custom-style>
    <style is="custom-style">
      html {
        --app-drawer-width: 350px;
      }
      :host, .paper-item {
        display: block;
        position: relative;
        min-height: var(--paper-item-min-height, 48px);
        padding: 0px 16px;
      }
      body {
        margin: 0;
        font-family: 'Roboto', 'Noto', sans-serif;
        background-color: #eee;
      }
      app-toolbar {
        background-color: #4285f4;
        color: #fff;
      }
      app-drawer-layout:not([narrow]) [drawer-toggle] {
        display: none;
      }
      app-drawer {
        --app-drawer-content-container: {
          background-color: #B0BEC5;
        }
      }
      .drawer-contents {
        height: 100%;
        overflow-y: auto;
      }
      ul{
          list-style-type: none;
      }
      li{
          padding-top: 12px;
      }
      
      a{
          text-decoration: none;
          font-size: x-large;
      }

    </style>
  </custom-style>
    <app-location use-hash-as-path route="{{route}}"></app-location>
    <app-route route="{{route}}" pattern="/:page" data="{{routeData}}" tail="{{subroute}}"></app-route>
            <app-drawer-layout>
                <app-drawer slot="drawer">
            
                    <div class="drawer-contents">
                        <ul>
                                <li>
                                  <a href="#/stocks"> All Stocks </a>
                                </li>        
                                <li>
                                    <a href="#/review"> Review Orders </a>
                                </li>
                                <li>
                                    <a href="#/buy"> Buy Stocks </a>
                                </li>
                               
                        </ul>
                    </div>          
                </app-drawer>
                <app-header-layout>
                    <app-header slot="header">
                    <app-toolbar>
                        <paper-icon-button icon="menu" drawer-toggle></paper-icon-button>
                        <div main-title>
                            ING TRADE  
                        </div>
                    </app-toolbar>
                    </app-header>
                    <iron-pages selected="[[page]]" attr-for-selected="name" selected-attribute="visible" fallback-selection="404">
                      <review-order name="review" route="{{route}}"></review-order> 
                      <place-order name="buy" stock="[[stockData]]" route="{{route}}"></place-order> 
                      <all-orders name="stocks" route="{{route}}"></all-orders> 
                    </iron-pages>
                </app-header-layout>
            </app-drawer-layout>
    `;
  }
}

window.customElements.define('main-app', MainApp);
