import {Component, OnInit, ElementRef, NgZone, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  D3Service,
  D3,
  Selection
} from 'd3-ng2-service';
import * as _ from 'lodash';

@Component({
  selector: 'attr-rank-bar-graph',
  template: '<div id="canvas" width="400" height="60"></div>',
  styleUrls: ['./attr-rank-graph.component.css']
})
export class AttrRankGraphComponent implements OnInit {
  private _dataSet = {};
  private _selectedInitial: any = {};
  private _indicatorName = '';
  private _countryNames = [];
  private _selectedCountry = 'USA';
  private _selectedAverage: any = {};
  private _countryDataSetComplete: any = [];
  private _aggregatedDataCountrySelections: any = [];
  private _aggregatedDataCountrySelectionsNoData: any = [];
  private _colorMap: any = {};
  private _singleAttrSet: any = {}
  private _multiTierAttrSet: any = {};
  private _year: number = 2001;
  private _setByDateSet: any;

  @Input()
  set multiTierAttrSet(data: any) {
    this._multiTierAttrSet = data;
  }

  @Input()
  set singleAttrSet(data: any) {
    this._singleAttrSet = data;
    console.log('single attr set', this._singleAttrSet);
    this.aggregateDataSelections(data);
    //console.log('agg data selections', this.aggregateDataSelections())
    this.update();
  }


  @Input()
  set dataSet(data: any) {
    this._dataSet = data;
  }

  @Input()
  set countryNames(data: any) {
    this._countryNames = data;

    this._aggregatedDataCountrySelections = _.filter(this._countryDataSetComplete, d => {
      //console.log('index of', _.indexOf(this._countryNames, d.CountryCode))
      return _.indexOf(this._countryNames, d.countryCode) !== -1 && d.hasOwnProperty('data');
    });

    this._aggregatedDataCountrySelectionsNoData = _.filter(this._countryDataSetComplete, d => {
      //console.log('index of', _.indexOf(this._countryNames, d.CountryCode))
      return _.indexOf(this._countryNames, d.countryCode) !== -1 && !d.hasOwnProperty('data');
    });



  }

  @Input()
  set selectedInitial(data: any) {
    if (data) {
      //this._countryNames = [data['countrySelection']['countryName']];
      // for each set it will be, in teh update.
      // iterate through selected Initial list.
      // this.aggregateDataSelections(data);
      // this.update();
    }
    //console.log('data on inside', data);
  }

  @Input()
  set colorSet(data: any) {
    if (data) {
      this._colorMap = data;
      //console.log('color map inside!', this._colorMap)
      if (!!this._indicatorName) {this.update()}
    }
  }

  aggregateDataSelections(data) {

    if (data) {

      this._setByDateSet = _.map(data, j => {
        let smallMap =
          _(j)
            .filter(d => {
              return _.find(d.rankings, {year: this._year.toString()});
            })
            .map(d => {
              let rankForYear = _.find(d.rankings, {year: this._year.toString()});
              //if (rankForYear) {
                let rankForYear = rankForYear.rank;
                d.rankings = {attribute: d.attribute, year: this._year, ranking: rankForYear};
                let model = {rankings: null,shortAttrName: null};
                let result = _.pick(d, _.keys(model));
                console.log('result rankings', result['rankings']);
                console.log('d rankings', d.rankings);
                return result;
              //}
            }).valueOf();
        console.log('small map', smallMap);
        return smallMap

      });


      console.log('set by date set', this._setByDateSet)
    }
  }


  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  data: any;
  rectData: any;
  svg: any;
  g: any;
  xAxisCall: any;
  yAxisCall: any;

  margin = {top: 20, right: 10, bottom: 150, left: 100};
  width: number = 400;
  height: number = 400;
  y: any;
  x: any;
  color: any;
  countryDomain = ["Africa", "N.America", "Europe",
    "S. America", "Asia", "Australia"];
  min: any;
  max: any;
  extent: any;
  yAxisGroup: any;
  xAxisGroup: any;
  yLabel: any;
  xLabel: any;
  flag: boolean = true;
  valueType: string;
  t: any;
  newData: any;

  constructor(
    element: ElementRef,
    private ngZone: NgZone,
    d3Service: D3Service,
    private http: HttpClient
  ) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {

    if (this.parentNativeElement !== null) {
      this.setSVG();
      this.setOrdinalScale();
      this.buildScales();
      this.scaleBand();
      this.generateAxises()
    }

  }

  setSVG() {
    this.svg = this.d3.select(this.parentNativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
  }

  setOrdinalScale() {
    this.color = this.d3.scaleOrdinal()
      .domain(this.countryDomain)
      .range(this.d3.schemeCategory10);

  }

  buildScales() {
    this.y = this.d3.scaleLinear()
      .range([this.height, 0]);
  }

  scaleBand() {
    this.x = this.d3.scaleBand()
      .range([0, 400])
      .paddingInner(0.3)
      .paddingOuter(0.3)
  }

  generateAxises() {
    this.xAxisCall = this.d3.axisBottom(this.x);

    this.xAxisGroup = this.g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + this.height + ')')

    this.yAxisCall = this.d3.axisLeft(this.y);
    this.yAxisGroup = this.g.append('g')
      .attr('class', 'y-axis');
  }



  generateAxisesCalls() {
    this.yAxisGroup.transition(this.t).call(this.yAxisCall);
    this.xAxisGroup.transition(this.t).call(this.xAxisCall)
      .selectAll("text")
      .attr("y", '10')
      .attr("x", '-5')
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)");
  }


  update() {
    if (this.svg) {
      this.svg.selectAll('path.line').remove();
      this.svg.selectAll(".chart-line").remove();
      this.svg.selectAll(".x-axis").remove();
      this.svg.selectAll(".axis-label").remove();
      this.svg.selectAll(".y-axis").remove();
      this.svg.selectAll(".legend").remove();
      this.buildScales();
      this.scaleBand();
      this.generateAxises();
      this.generateAxisesCalls();
      this.addTransition();
      this.buildRectangles();
    }

  }


  addTransition() {
    this.t = this.d3.transition().duration(750);
  }


  buildRectangles() {

    console.log('test', this._setByDateSet);

    // data join
    if (Object.getOwnPropertyNames(this._setByDateSet).length > 0) {
      _.each(this._setByDateSet, (countryGroup, i) => {
        if(countryGroup.length > 0) {
          //_.each(countryGroup, countryGroup => {
          console.log('set', countryGroup);
          var rectangles = this.g.selectAll('rect')
            .data(countryGroup, d => {
              console.log('d attr', d)
              return d.rankings.ranking;
            });
          debugger;
          //exit old elements
          // rectangles.exit()
          //   .attr('fill', 'red')
          // .transition(this.t)
          //   .attr('y', this.y(0))
          //   .attr('height', 0)
          //   .remove();

          // enter
          rectangles.enter()
            .append('rect')
            .attr('y', d => this.y(0))
            .attr('x', (d, i) => {
              console.log('d rankings', d.rankings.ranking)
              return this.x(d.rankings.ranking)
            })
            .attr('width', this.x.bandwidth)
            .attr('height', 0)
            .attr('fill', 'blue')
            .merge(rectangles)
            .transition(this.t)
            .attr('y', d => {
              console.log('d attr', d['shortAttrName'])
              return this.y('test')
            })
            .attr('width', this.x.bandwidth)
            .attr('x', (d, i) => {return this.x(d.rankings.ranking)})
            .attr('height', d => {

              return this.height - this.y('test')
            })
        //})
       }

    }

  }



}
