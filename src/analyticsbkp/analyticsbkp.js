import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import * as d3 from 'd3';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-toast/paper-toast.js';
import '../shared-style/shared-style.js';

class AnalyticData extends PolymerElement{
    static get properties(){
        return {
            loadinData:{
                type: Boolean,
                value: true
            }
        }
    }
    static get template() {
        return html`
        <style>
            .bar {
                fill: steelblue;
            }
        </style>
            <svg id="mySVG" width="600" height="500"></svg>
            <template is="dom-if" if="[[loadingData]]">
                <div class="loading">Loading&#8230;</div>
            </template>
            <paper-toast id="toast" text="[[toastMessage]]" with-backdrop horizontal-align="center" vertical-align="middle"></paper-toast>
            <iron-ajax
                auto
                url="[[_getAnalyticsURL()]]"
                method="GET"
                on-response="handleResponse"
                on-error="handleError"
                handle-as="json"
                loading="{{loadinData}}">
            </iron-ajax>
        `;
    }
    _getAnalyticsURL(){
        return config.baseUrl + '/daystocks';
    }

    handleResponse(event){
        let reponseData = event.detail.response.map((stock) => {
            return {
                "category": stock.name,
                "amount": stock.volume
            }
        });
        this.generateBarChart(reponseData);
    }
    handleError(event){
        if(event){
          this.toastMessage = "Unable to process the request";
          this.$.toast.open();
        }
    }
    generateBarChart(data) {
        let svg = d3.select(this.$.mySVG);
        let margin = 200;
        let width = svg.attr("width") - margin;
        let height = svg.attr("height") - margin;
        let xScale = d3.scaleBand().range([0, width]).padding(0.4);
        let yScale = d3.scaleLinear().range([height, 0]);
        svg.append("text")
            .attr("transform", "translate(100,0)")
            .attr("x", 50)
            .attr("y", 50)
            .attr("font-size", "24px")
            .text("Stock History")

        let g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

        xScale.domain(data.map(function (d) { return d.category; }));
        yScale.domain([0, d3.max(data, function (d) { return d.amount; })]);

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("y", height - 250)
            .attr("x", width - 100)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Stocks");

        g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function (d) {
                return "$" + d;
            }).ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-5.1em")
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("Volume");

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return xScale(d.category); })
            .attr("y", function (d) { return yScale(d.amount); })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) { return height - yScale(d.amount); });
    }

}
customElements.define('analyticsbkp-app', AnalyticData);