import {Component, OnInit, ElementRef, NgZone, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  D3Service,
  D3,
  Selection
} from 'd3-ng2-service';
import {countryMap} from '../../../assets/maps/country-maps';
import * as _ from 'lodash';

@Component({
  selector: 'app-starburst',
  templateUrl: './starburst.component.html',
  styleUrls: ['./starburst.component.css']
})
export class StarburstComponent implements OnInit {
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
  private _attrCategories: any;
  private _renderTimeout: any;
  private _nodeDataArray: any;
  private _classObj: any = this;


  @Input()
  set year(data: any) {
    this._year = data;
    this.aggregateData();
  }

  @Input()
  set multiTierAttrSet(data: any) {
    this._multiTierAttrSet = data;
    this.aggregateData();
  }

  @Input()
  set singleAttrSet(data: any) {
    this._singleAttrSet = data;
  }


  @Input()
  set dataSet(data: any) {
    this._dataSet = data;
  }

  @Input()
  set countryNames(data: any) {
    this._countryNames = data;

    this._aggregatedDataCountrySelections = _.filter(this._countryDataSetComplete, d => {
      return _.indexOf(this._countryNames, d.countryCode) !== -1 && d.hasOwnProperty('data');
    });

    this._aggregatedDataCountrySelectionsNoData = _.filter(this._countryDataSetComplete, d => {
      return _.indexOf(this._countryNames, d.countryCode) !== -1 && !d.hasOwnProperty('data');
    });

    this.aggregateData();

  }

  @Input()
  set selectedInitial(data: any) {
  }

  @Input()
  set colorSet(data: any) {
     if (data) {
    //   this._colorMap = data;
       if (this._multiTierAttrSet) {this.aggregateData();}
    }
  }

  aggregateData() {
    if (this._multiTierAttrSet) {
      console.log('second teir', this._multiTierAttrSet);
      let dataMassagedArray = _.map(this._multiTierAttrSet, (key, value) => {
        console.log('key', key);
        console.log('value', this._multiTierAttrSet[value]);
        console.log('value', this._multiTierAttrSet[key]);
        const name1 = value;
        const children1 = [];

        for (const i in this._multiTierAttrSet[value]) {
          let nestedChildren = [];
          for (const j in this._multiTierAttrSet[value][i]) {
            console.log('test', this._multiTierAttrSet[value][i][j]['rankings'])
            let yearRank = _.find(this._multiTierAttrSet[value][i][j]['rankings'], {year: this._year.toString()});
            if (yearRank) {
              nestedChildren.push({name: this._multiTierAttrSet[value][i][j]['attribute'], size: yearRank.rank});
            }
          }
          children1.push({name: i, children: nestedChildren});
          if (nestedChildren) {
            this._dataloaded = true;
          }
        }

        return {
          name: value,
          children: children1
        };


      });
      console.log('data masssaged', dataMassagedArray);
      console.log('final model', {name: 'flare', children: dataMassagedArray});
      this._nodeDataArray = {name: 'flare', children: dataMassagedArray};
      this.update();
    }
  }

  dataLoaded(country) {
    return (country.data.length > 0) && (country.data[0].hasOwnProperty('rankings'));
  }

  private d3: D3;
  private parentNativeElement: any;
  data: any;
  svg: any;
  g: any;
  xAxisCall: any;
  yAxisCall: any;

  margin = {top: 20, right: 10, bottom: 150, left: 100};
  width: number = 960;
  height: number = 700;
  radius:number = (Math.min(this.width, this.height) / 2) - 10;
  y: any;
  x: any;
  x2: any;
  color: any;
  countryDomain = ['Africa', 'N.America', 'Europe',
    'S. America', 'Asia', 'Australia'];
  yAxisGroup: any;
  xAxisGroup: any;
  partition: any;
  t: any;
  path: any;
  text: any;
  _dataloaded: boolean = false;
  arc: any;

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

  partitionAdd() {
    this.partition = this.d3.partition();
  }

  arcFunction() {
    this.arc = this.d3.arc()
      .startAngle(d =>  { return Math.max(0, Math.min(2 * Math.PI, this.x(d.x0))); })
      .endAngle(d =>  { return Math.max(0, Math.min(2 * Math.PI, this.x(d.x1))); })
      .innerRadius(d =>  {
        console.log('this y', this.y);
        console.log('typeof', typeof this.y);
        return Math.max(0, this.y(d.y0)); }
      )
      .outerRadius(d => { return Math.max(0, this.y(d.y1)); });
  }

  buildStarburst() {
    let root = this.d3.hierarchy(this._nodeDataArray)
      .sum(d => d.size);
    console.log('initial array', this._nodeDataArray);
    console.log('root', root);
    console.log('partition root', this.partition(root).descendants())
    let classObj = this;
    this.path = this.svg.selectAll('path')
      .data(this.partition(root).descendants())
      .enter().append('path')
        .attr('d', this.arc)
        .style('fill', d => { return this.color((d.children ? d : d.parent).data.name)})
      .on('click', d => {
        classObj.svg.transition()
          .duration(750)
          .tween("scale", () => {
            let xd = this.d3.interpolate(this.x.domain(), [d.x0, d.x1]),
              yd = this.d3.interpolate(this.y.domain(), [d.y0, 1]),
              yr = this.d3.interpolate(this.y.range(), [d.y0 ? 20 : 0, this.radius]);
            return t => { classObj.x.domain(xd(t)); classObj.y.domain(yd(t)).range(yr(t)); };
          })
          .selectAll("path")
          .attrTween("d", function(d) { return function() { return classObj.arc(d); }; });
      });

    // this.text = this.g.append('text')
    //   .attr('transform', function(d) { return 'rotate(' + this.computeTextRotation(d) + ')'; })
    //   .attr('x', function(d) { return this.y(d.y); })
    //   .attr('dx', '6') // margin
    //   .attr('dy', '.35em') // vertical-align
    //   .text(function(d) { return d.name; });
  }

  click(d) {
    let classObj = this;
    classObj.svg.transition()
      .duration(750)
      .tween("scale", () => {
        let xd = this.d3.interpolate(this.x.domain(), [d.x0, d.x1]),
          yd = this.d3.interpolate(this.y.domain(), [d.y0, 1]),
          yr = this.d3.interpolate(this.y.range(), [d.y0 ? 20 : 0, this.radius]);
        return t => { classObj.x.domain(xd(t)); classObj.y.domain(yd(t)).range(yr(t)); };
      })
      .selectAll("path")
      .attrTween("d", function(d) { return function() { return this.arc(d); }; });
  }

  arcTween(d) {
    var xd = this.d3.interpolate(this.x.domain(), [d.x, d.x + d.dx]),
      yd = this.d3.interpolate(this.y.domain(), [d.y, 1]),
      yr = this.d3.interpolate(this.y.range(), [d.y ? 20 : 0, this.radius]);
    return function(d, i) {
      return i
        ? function(t) { return this.arc(d); }
        : function(t) { this.x.domain(xd(t)); this.y.domain(yd(t)).range(yr(t)); return this.arc(d); };
    };
  }

  computeTextRotation(d) {
    return (this.x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
  }

  setSVG() {
    this.svg = this.d3.select(this.parentNativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + (this.height / 2 + 10) + ')');
  }

  setOrdinalScale() {
    this.color = this.d3.scaleOrdinal()
      //.domain(this.countryDomain)
      .range(this.d3.schemeCategory10);
  }

  buildScales() {}

  scaleBand() {}

  generateAxises() {}

  generateAxisesCalls() {}

  update() {
    console.log('update');
    if (this.svg && this._nodeDataArray && this._dataloaded) {
      this.buildXYScales();
      this.partitionAdd();
      this.arcFunction();
      this.buildStarburst();
    }
  }

  buildXYScales() {
    this.x = this.d3.scaleLinear()
      .range([0, 2 * Math.PI]);

    this.y = this.d3.scaleSqrt()
      .range([0, this.radius]);
  }


  addTransition() {
    this.t = this.d3.transition().duration(750);
  }

  buildRectangles() {}


}
