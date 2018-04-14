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
    //this.update();
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

      const setByDateSet = _.forEach(data, j => {
        return _.map(j, d => {
          console.log('d inside', d);
          let rankForYear = _.find(d.rankings, {year: this._year.toString()});
          if (rankForYear) {
            rankForYear = rankForYear.rank;
            console.log('this set', {attribute: d.attribute, year: this._year, ranking: rankForYear})
            d.rankings = {attribute: d.attribute, year: this._year, ranking: rankForYear}

            let model = {
              rankings: null,
              shortAttrName: null
            };

            let result = _.pick(d, _.keys(model));

            console.log('result', result);

            return result;
          }
        })

      });

      console.log('set by date set', setByDateSet)
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
    }

  }

  setMinAndMax() {
    console.log('test', this._aggregatedDataCountrySelections);
    this.min = this.d3.min( this._aggregatedDataCountrySelections, d => {
      return d['height'];
    });
    this.max = this.d3.max( this._aggregatedDataCountrySelections, d => {
      return d['height'];
    })
    this.extent = this.d3.extent( this._aggregatedDataCountrySelections, d => {
      return d['height'];
    })
  }

  scaleBand() {
    this.x = this.d3.scaleBand()
      .range([0, 400])
      .paddingInner(0.3)
      .paddingOuter(0.3)
  }

  buildScaleBandDomain() {
    console.log('test', this._aggregatedDataCountrySelections);
    this.x.domain( this._aggregatedDataCountrySelections.data.map(d => { return d.rank}));
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

  buildScaleDomain() {
    let extent = this.d3.extent(this.newData, d => {return d[this.valueType]});
    let x = parseInt(extent[0]);
    let y = parseInt(extent[1]);
    this.y.domain([x, y]);
  }


  getRevenuesBuildRectangles() {

    this.http.get<any[]>('../assets/data/revenues.json').subscribe(res =>{
      this.rectData = res;
      this.rectData.forEach(d => {
        d.revenue = +d.revenue;
        d.profit = +d.profit;
      });
      //this.buildScales();
      //this.scaleBand();
      //this.generateAxises();
      this.d3.interval(d => {
        //this.newData = this.rectData;
        this.newData = this.flag ? this.rectData : this.rectData.slice(1);
        //this.update();
        this.flag = !this.flag;
      }, 1000);
      //this.generateLabels();

    },error =>{console.log('Error')});

    // this.buildScales();
    // this.scaleBand();
    // this.generateAxises();
    // this.update();
    //this.generateLabels();
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
      //this.setMinAndMax();

      //this.buildScaleBandDomain();


      this.addTransition();
      this.buildRectangles();
      //toDo: break this out
      this.generateLabels();

      //this.dataTimeFilter();


    }

    //this.valueType = this.flag ? 'revenue' : 'profit';

    //this.buildScaleDomain();
    //this.generateAxisesCalls();
    //this.addTransition();
    //this.buildRectangles();
    //this.updateLabelText();
  }

  updateLabelText() {
    this.yLabel.text(this.valueType);
  }

  addTransition() {
    this.t = this.d3.transition().duration(750);
  }


  generateLabels() {
    this.xLabel = this.g.append("text")
      .attr('class', 'x axis-label')
      .attr('x', this.width/ 2)
      .attr('y', this.height + 140)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .text(this.valueType);

    this.yLabel = this.g.append('text')
      .attr('class', 'y axis-label')
      .attr('x', -(this.height/ 2))
      .attr('y', -60)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text(this.valueType + ' (m)');
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

  setSVG() {
    this.svg = this.d3.select(this.parentNativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
  }

  buildRectangles() {

    console.log('test', this._aggregatedDataCountrySelections);

    // data join
    var rectangles = this.g.selectAll('rect')
      .data(this.newData, d => {
        return d.rank;
      });

    // exit old elements
    rectangles.exit()
      .attr('fill', 'red')
    .transition(this.t)
      .attr('y', this.y(0))
      .attr('height', 0)
      .remove();

    // enter
    rectangles.enter()
      .append('rect')
      .attr('y', d => this.y(0))
      .attr('x', (d, i) => {return this.x(d.month)})
      .attr('width', this.x.bandwidth)
      .attr('height', 0)
      .attr('fill', 'blue')
      .merge(rectangles)
      .transition(this.t)
          .attr('y', d => {return this.y(d[this.valueType])})
          .attr('width', this.x.bandwidth)
          .attr('x', (d, i) => {return this.x(d.month)})
          .attr('height', d => {return this.height - this.y(d[this.valueType])})

  }

  buildCircles() {
    var circles = this.g.selectAll('circle')
      .data(this.data);


    circles.enter()
      .append('circle')
      .attr('cx', (d, i) => {
        return 50 + i * 50;
      })
      .attr('cy', 100)
      .attr('r', (d) => {
        return d.age * 2;
      })
      .attr('fill', d =>{
        if (d.month == 'March') {
          return 'blue'
        } else {
          return 'pink'
        }
      })
  }


}
