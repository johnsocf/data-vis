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

    //this.aggregateDataSelections(data);

  }

  @Input()
  set selectedInitial(data: any) {
  }

  @Input()
  set colorSet(data: any) {
    // if (data) {
    //   this._colorMap = data;
    //   if (this._singleAttrSet) {this.aggregateDataSelections(data);}
    // }
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
        }
        return {
          name: value,
          children: children1
        };


      });
      console.log('data masssaged', dataMassagedArray);
      console.log('final model', {name: 'flare', children: dataMassagedArray});
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

  scaleBand() {}

  generateAxises() {}

  generateAxisesCalls() {}

  update() {
    if (this.svg) {}
  }

  addTransition() {
    this.t = this.d3.transition().duration(750);
  }

  buildRectangles() {}


}
