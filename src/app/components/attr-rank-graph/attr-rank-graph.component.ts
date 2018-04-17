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
  private _indicatorName = '';
  private _countryNames = [];
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

      this._setByDateSet = _.map(data, (j, k) => {
        console.log('k', k);
        let smallMap =
          _(j)
            .filter((d, e) => {
              return _.find(d.rankings, {year: this._year.toString()});
            })
            .map((d, e) => {

              let rankForYearObj = _.find(d.rankings, {year: this._year.toString()});
              //if (rankForYear) {
                let rankForYear = rankForYearObj.rank;
                d.rankings = {attribute: d.attribute, year: this._year, ranking: rankForYear, countryCode: k};
                let model = {rankings: null,shortAttrName: null, countryCode: null};
                let result = _.pick(d, _.keys(model));
                console.log('result rankings', result['rankings']);
                console.log('d rankings', d.rankings);
                return result;
              //}
            }).valueOf();
        console.log('small map', smallMap);
        return {countryCode: k, data: smallMap}
        //return smallMap

      });


      console.log('set by date set', this._setByDateSet)
    }
  }


  private d3: D3;
  private parentNativeElement: any;
  data: any;
  svg: any;
  g: any;
  xAxisCall: any;
  yAxisCall: any;

  margin = {top: 20, right: 10, bottom: 150, left: 100};
  width: number = 400;
  height: number = 400;
  y: any;
  x: any;
  x2: any;
  color: any;
  countryDomain = ["Africa", "N.America", "Europe",
    "S. America", "Asia", "Australia"];
  yAxisGroup: any;
  xAxisGroup: any;
  t: any;

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
      //this.buildScales();
      //this.scaleBand();
      //this.generateAxises()
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
      .domain([0, 10])
      .range([this.height, 0]);
  }

  scaleBand() {
    console.log('scale band', this._setByDateSet)
    if (this._setByDateSet[0] && this._setByDateSet[0].hasOwnProperty('data')) {
      let testArray = _.map(this._setByDateSet[0]['data'], d => {
        console.log('d scale band', d)
        return d['rankings']['attribute'];
      });
      console.log('test array', testArray)

      this.x = this.d3.scaleBand()
        .domain(testArray)
        .range([0, 400])
        .paddingInner(0.3)
        .paddingOuter(0.3)


      this.x.rangeRound([0, this.width])
        .paddingInner(0.1);

      this.x2 = this.d3.scaleBand()
        .padding(0.05);
    }
  }

  generateAxises() {
    this.xAxisCall = this.d3.axisBottom(this.x)
      .ticks(10)
      .tickPadding(10)

    this.xAxisGroup = this.g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + this.height + ')')

    console.log('this y', this.y)
    this.yAxisCall = this.d3.axisLeft(this.y)
      .ticks(6)

    console.log('this y', this.yAxisCall)
    this.yAxisGroup = this.g.append('g')
      .attr('class', 'y-axis');
  }



  generateAxisesCalls() {
    this.yAxisGroup.transition(this.t).call(this.yAxisCall)

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
      this.addTransition();
      this.buildScales();
      if (this._setByDateSet[0] && this._setByDateSet[0].hasOwnProperty('data')) {
        this.scaleBand();
        this.generateAxises();
        this.generateAxisesCalls();
      }

      this.buildRectangles();
    }

  }


  addTransition() {
    this.t = this.d3.transition().duration(750);
  }


  buildRectangles() {

    console.log('test', this._setByDateSet);
    // data join
    let parentclassobj = this;
    if (Object.getOwnPropertyNames(this._setByDateSet).length > 0) {
      _.each(this._setByDateSet, (countryGroup, i) => {

        if (countryGroup.data && countryGroup.data.length && countryGroup.data[0].hasOwnProperty('rankings')) {
          console.log('keys', countryGroup.data.slice(1));
          const keys = countryGroup.data.slice(1);
          console.log('keys', keys);
          console.log('data', countryGroup.data)

          this.x.domain(countryGroup.data.map(d => { return d.rankings['attribute']; }));
          this.x2.domain(keys).rangeRound([0, this.x.bandwidth()]);

          let rects = this.g.append('g')
            .selectAll('g')
            .data(countryGroup.data);
            rects.exit()
              .attr('fill', 'red')
            .transition(this.t)
              .attr('y', this.y(0))
              .attr('height', 0)
              .remove();
            rects.enter().append('g')
              .attr("transform", function(d) { return "translate(" + parentclassobj.x(d.rankings.attribute) + ",0)"; })
            .selectAll('rect')
            .data(d => {
              return keys.map(key => {
                console.log('key', key.rankings);
                console.log('return obj', {
                  key: key.rankings['attribute'],
                  value: d.rankings['ranking']
                });
                return {
                  key: key.rankings['attribute'],
                  value: d.rankings['ranking'],
                  code: d.rankings['countryCode']
                };
              });
            })
            .enter().append('rect')
            .attr('x', d => {return this.x(d.key)})
            .attr('y', d => {return this.y(d.value)})
            .attr('width', this.x2.bandwidth)
            .attr('height', d => {
              return this.height - this.y(d.value)
            })
            .attr('fill', d => {
              return this._colorMap[d.code]
            })
        }


            // console.log('set', countryGroup);
            // console.log('i', i)
            // var rectangles = this.g.selectAll('rect')
            //   .data(countryGroup.data);
            //exit old elements
            // rectangles.exit()
            //   .attr('fill', 'red')
            // .transition(this.t)
            //   .attr('y', this.y(0))
            //   .attr('height', 0)
            //   .remove();

            // enter

          // .enter()
          //     .append('rect')
          //     .attr('y', d => this.y(d.rankings.ranking))
          //     .attr('x', (d, i) => {
          //       console.log('d rankings', d)
          //       return this.x(d.rankings.attribute);
          //     })
          //     .attr('width', this.x.bandwidth)
          //     .attr('height', 0)
          //     .attr('fill', d => {
          //       console.log('color', this._colorMap)
          //       console.log('color code', d.rankings.countryCode)
          //       console.log('mapped', this._colorMap[d.rankings.countryCode])
          //       return this._colorMap[d.rankings.countryCode]
          //     })
          //     .merge(rectangles)
          //     .transition(this.t)
          //     .attr('y', d => {
          //       console.log('d attr', d['shortAttrName'])
          //       return this.y(d.rankings.ranking);
          //     })
          //     .attr('width', this.x.bandwidth)
          //     .attr('x', (d, i) => {return this.x(d.rankings.attribute)})
          //     .attr('height', d => {
          //       return this.height - this.y(d.rankings.ranking)
          //     })
        //});
      });

    }

  }



}
