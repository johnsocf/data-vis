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
  private _attrCategories: any;

  @Input()
  set multiTierAttrSet(data: any) {
    this._multiTierAttrSet = data;
  }

  @Input()
  set singleAttrSet(data: any) {
    this._singleAttrSet = data;
    this.aggregateDataSelections(data);
    //console.log('agg data selections', this.aggregateDataSelections())
    // this.update();
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
      if (this._singleAttrSet) {this.update()}
    }
  }

  aggregateDataSelections(data) {

    if (this._singleAttrSet && this._colorMap && _.keysIn(this._colorMap).length > 0) {

      this._setByDateSet = _.map(this._singleAttrSet, (j, k) => {
        let smallMap =
          _(j)
            .filter((d) => {
              return _.find(d.rankings, {year: this._year.toString()});
            })
            .map((d) => {
              let rankForYearObj = _.find(d.rankings, {year: this._year.toString()});
              let rankForYear = rankForYearObj.rank;
              d.rankings = {attribute: d.attribute, year: this._year, ranking: rankForYear, countryCode: k};
              let model = {rankings: null,shortAttrName: null, countryCode: null};
              let result = _.pick(d, _.keys(model));
              return result;
            }).valueOf();
        return {countryCode: k, data: smallMap}

      });


      this._attrCategories = _.reduce(this._setByDateSet, (flattened, country) => {
        if (this.dataLoaded(country)) {
          return _.uniq(flattened.concat(_.map(country.data, d => d.rankings.attribute)));
        }
      }, []);
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
  width: number = 800;
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
    if (this._setByDateSet[0] && this._setByDateSet[0].hasOwnProperty('data')) {
      let testArray = _.map(this._setByDateSet[0]['data'], d => {
        return d['rankings']['attribute'];
      });

      this.x = this.d3.scaleBand()
        .domain(this._attrCategories)
        .range([0, this.width])
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
      //.ticks(10)
      .tickPadding(1)

    this.xAxisGroup = this.g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + this.height + ')')

    this.yAxisCall = this.d3.axisLeft(this.y)
      //.ticks(6)

    this.yAxisGroup = this.g.append('g')
      .attr('class', 'y-axis');
  }



  generateAxisesCalls() {
    console.log('bandwidth?', this.x.bandwidth())
    this.yAxisGroup.transition(this.t).call(this.yAxisCall)

    this.xAxisGroup.transition(this.t).call(this.xAxisCall)
      .selectAll("text")
      //.call(this.wrap, this.x.bandwidth(), this)
      .attr("y", '0')
      .attr("x", '0')
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")

  }


  update() {
    if (this.svg) {
      this.svg.selectAll(".chart-bar").remove();
      this.svg.selectAll('path.line').remove();
      this.svg.selectAll(".x-axis").remove();
      this.svg.selectAll(".axis-label").remove();
      this.svg.selectAll(".y-axis").remove();
      this.addTransition();
      this.buildScales();
      if (this._attrCategories && this._setByDateSet[0] && this._setByDateSet[0].hasOwnProperty('data')) {
        this.scaleBand();
        this.generateAxises();
        this.generateAxisesCalls();
        this.buildRectangles();
      }


    }

  }


  addTransition() {
    this.t = this.d3.transition().duration(750);
  }


  buildRectangles() {

    console.log('bandwidth x2', this.x2.bandwidth);
    console.log('bandwidth x1', this.x.bandwidth);
    // data join
    let parentclassobj = this;
    let currentWidth = this._setByDateSet.length;
    if (Object.getOwnPropertyNames(this._setByDateSet) && Object.getOwnPropertyNames(this._setByDateSet).length > 0 && this._attrCategories.length > 0) {
      _.each(this._setByDateSet, (countryGroup, i) => {

        if (countryGroup.data && countryGroup.data.length && countryGroup.data[0].hasOwnProperty('rankings')) {
          const keys = countryGroup.data.slice(1);
          this.x.domain(this._attrCategories);
          this.x2.domain(keys).rangeRound([0, this.x.bandwidth()]);


          let rects = this.svg.append('g')
            .attr("transform", d => {
              return "translate(0,20)";
            })
            .selectAll('g')
            .data(countryGroup.data)

            rects.exit()
              .attr('fill', 'red')
            .transition(this.t)
              .attr('y', this.y(0))
              .attr('height', 0)
              .remove();
            rects.enter().append('g')
              .attr("transform", function(d) {
                return "translate(" + parentclassobj.x(d.rankings.attribute) + ",0)";
              })
            .selectAll('rect')
            .data(d => {
              return keys.map(key => {
                return {
                  key: d.rankings['attribute'],
                  value: d.rankings['ranking'],
                  code: d.rankings['countryCode']
                };
              });
            })
            .enter().append('rect')
            .attr("class", "chart-bar")
            .attr('y', d => this.y(0))
            .attr('x', (d, i) => {return this.x(d.key) + (i * this.x2.bandwidth()/currentWidth) + 5})
            .attr('width', this.x.bandwidth())
            .attr('height', 0)
            .attr('fill', 'blue')
            .merge(rects)
            .transition(this.t)
              .attr('x', d => {
                return this.x(d.key) + (i * this.x2.bandwidth()/currentWidth) + 5;
              })
              .attr('y', d => {
                return this.y(d.value)
              })
              .attr('width', this.x2.bandwidth()/currentWidth)
              .attr('height', d => {
                return this.height - this.y(d.value);
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
