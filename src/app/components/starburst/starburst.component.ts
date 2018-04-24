import {Component, OnInit, ElementRef, NgZone, Input, ChangeDetectorRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  D3Service,
  D3,
  Selection
} from 'd3-ng2-service';
import * as _ from 'lodash';
import {colorSet20b, colorSetRed, colorSetGreen, colorSetBlue} from '../../../assets/colorSets/color-set';
import {electricityChildren, emissionsChildren, populationChildren} from '../../../assets/colorSets/color-legend';

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
    if (this._countryNames) {
      this.aggregateData();
    }
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
    this._colorMap = data;
       if (this._multiTierAttrSet) {this.aggregateData();}
    }
  }

  aggregateData() {
    if (this._multiTierAttrSet) {
      let dataMassagedArray = _.map(this._multiTierAttrSet, (key, value) => {
        const name1 = value;
        const children1 = [];

        for (const i in this._multiTierAttrSet[value]) {
          let nestedChildren = [];
          for (const j in this._multiTierAttrSet[value][i]) {
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
  margin = {top: 20, right: 10, bottom: 150, left: 100};
  width: number = 360;
  height: number = 300;
  radius:number = (Math.min(this.width, this.height) / 2) - 10;
  y: any;
  x: any;
  x2: any;
  color: any;
  partition: any;
  t: any;
  path: any;
  text: any;
  arc: any;
  _dataloaded: boolean = false;

  colorReds: any;
  colorGreens: any;
  colorBlues: any;

  selectedName: string;
  totalLegendKey:[];

  constructor(
    element: ElementRef,
    private ngZone: NgZone,
    d3Service: D3Service,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {

    if (this.parentNativeElement !== null) {
      this.setSVG();
    }

  }

  partitionAdd() {
    this.partition = this.d3.partition();
  }

  arcFunction() {
    this.arc = this.d3.arc()
      .startAngle(d =>  { return Math.max(0, Math.min(2 * Math.PI, this.x(d.x0))); })
      .endAngle(d =>  { return Math.max(0, Math.min(2 * Math.PI, this.x(d.x1))); })
      .innerRadius(d =>  {return Math.max(0, this.y(d.y0)); })
      .outerRadius(d => { return Math.max(0, this.y(d.y1)); });
  }

  buildStarburst() {
    let root = this.d3.hierarchy(this._nodeDataArray)
      .sum(d => d.size);
   let classObj = this;

    this.g = this.svg.selectAll('g')
      .attr('id', 'starburst-svg')
      .data(this.partition(root).descendants())
      .enter().append('g');

    this.path = this.g.append('path')
      .attr('class', 'starburst-path')
      .attr('d', this.arc)
        .style('fill', d => {
          if ('flare' == d.data.name) {
            return '#000000';
          }
          if (d.children && this._countryNames.includes(d.data.name)) {
            return this.color(d.data.name);
          }
          if (electricityChildren.includes(d.data.name)) {
            return this.colorReds(d.data.name);
          } else if (emissionsChildren.includes(d.data.name)) {
            return this.colorGreens(d.data.name);
          } else if (populationChildren.includes(d.data.name)) {
            return this.colorBlues(d.data.name);
          }
          return '#BADA55';

        })
      .on('click', d => {
          console.log('clicked', d);
          console.log('this clicked', this);
          let parentElem = d.data.name;
          classObj.selectedName = parentElem;
          classObj.svg.transition()
          .duration(750)
          .tween('scale', () => {
            let xd = this.d3.interpolate(this.x.domain(), [d.x0, d.x1]),
              yd = this.d3.interpolate(this.y.domain(), [d.y0, 1]),
              yr = this.d3.interpolate(this.y.range(), [d.y0 ? 20 : 0, this.radius]);
            return t => { classObj.x.domain(xd(t)); classObj.y.domain(yd(t)).range(yr(t)); };
          })
          .selectAll('path')
          .attrTween('d', function(d) { return function() { return classObj.arc(d); }; })
          .on('start', (e, i) => {
          })
          .on('end', function(e, i) {
            // check if the animated element's data e lies within the visible angle span given in d
            if (e.x0 > d.x0 && e.x0 < d.x1) {
              // get a selection of the associated text element
              const arcText = classObj.d3.select(this.parentNode).select('text');
              console.log('this', this);
              console.log('this', this.parentElement.textContent);

              //let allText = classObj.d3.selectAll('.text-node').attr('display', 'none');

              // fade in the text element and recalculate positions
              arcText.transition().duration(750)
                .attr('opacity', 1)
                .attr('class', 'visible')
                .attr('transform', d => { return 'rotate(' +  ((classObj.x((d.x0 + d.x1)/2) - Math.PI / 2) / Math.PI * 180) + ')' })
                .attr('x', d => { return classObj.y(d.y0); })
                .style('display', d => {
                  console.log('d', d);
                  if (d.parent.data.name === parentElem && !d.children && d.data.name !== 'weather') {
                  //if (!d.children) {
                    return 'block';
                  }
                  return 'none';
                })
                .text(d => {
                  return d.data.name === 'root' ? '' : d.data.name
                });
            } else {
              const arcText = classObj.d3.select(this.parentNode).select('text');

              arcText.transition().duration(750)
                .attr('opacity', 0)
                .style('display', d => {
                  console.log('d', d);
                  // if (classObj.totalLegendKey.includes(d.data.name) && d.data.name !== 'weather') {
                  //   return 'block';
                  // }
                  return 'none';
                })
                .text(d => {
                  return d.data.name === 'root' ? '' : d.data.name
                });
            }
          });
      });

    this.text = this.g.append('text')
      .attr('class', 'text-node')
      .attr('transform', d => {return 'rotate(' + ((this.x((d.x0 + d.x1)/2) - Math.PI / 2) / Math.PI * 180) + ')'})
      .attr('x', d => { return this.y(d.y0); })
      .attr('dx', '6') // margin
      .attr('dy', '.35em') // vertical-align
      .style('display','none')
      .text(function(d) {
        return d.data.name === 'root' ? '' : d.data.name;
      });
  }

  setSVG() {
    this.svg = this.d3.select('#starburst-canvas')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + (this.height / 2 + 10) + ')');
  }

  setOrdinalScale() {
    this.color = this.d3.scaleOrdinal(this.d3.schemeCategory10);
    this.colorReds = this.d3.scaleOrdinal(colorSetRed.reverse())
      .domain(emissionsChildren);
    this.colorGreens = this.d3.scaleOrdinal(colorSetGreen.reverse())
      .domain(electricityChildren);
    this.colorBlues = this.d3.scaleOrdinal(colorSetBlue.reverse())
      .domain(populationChildren);
  }

  update() {
    if (this.svg && this._nodeDataArray && this._dataloaded) {
      this.svg.selectAll('path.line').remove();
      this.svg.selectAll('path').remove();
      this.svg.selectAll('g').remove();
      this.svg.selectAll('text').remove();
      this.d3.select('#legend-svg').remove();
      this.selectedName = '';

      this.setOrdinalScale();
      this.buildXYScales();
      this.partitionAdd();
      this.arcFunction();
      this.buildStarburst();
      this.drawLegend();
    }
  }

  buildXYScales() {
    this.x = this.d3.scaleLinear()
      .range([0, 2 * Math.PI]);

    this.y = this.d3.scaleSqrt()
      .range([0, this.radius]);
  }

  drawLegend() {

    this.totalLegendKey = [...electricityChildren, ...emissionsChildren, ...populationChildren];
    // Dimensions of legend item: width, height, spacing, radius of rounded rect.
    const li = {
      w: 75, h: 15, s: 3, r: 3
    };

    const legend = this.d3.select('#legend').append('svg:svg')
      .attr('id', 'legend-svg')
      .attr('width', '700px')
      .attr('height', d => {
        return this.totalLegendKey.length * (li.h + li.s);
      });
    let objElement = this;


    let g = legend.selectAll('g')
      .attr('id', 'legend')
      .data(this.totalLegendKey)
      .enter().append('svg:g')
      .attr('transform', function(d, i) {
        return 'translate(0,' + i * (li.h + li.s) + ')';
      });

    g.append('svg:rect')
      .attr('rx', li.r)
      .attr('ry', li.r)
      .attr('width', d => {
        return d.length * 6;
      })
      .attr('height', li.h)
      .style('fill', d => {
        if ('flare' == d) {
          return '#FFFFFF';
        }
        if (electricityChildren.includes(d)) {
          return this.colorReds(d);
        } else if (emissionsChildren.includes(d)) {
          return this.colorGreens(d);
        } else if (populationChildren.includes(d)) {
          return this.colorBlues(d);
        }
        return '#BADA55';
      })

    g.append('svg:text')
      .attr('width', d => {
        return d.length * 7;
      })
      .attr('y', li.h / 2)
      .attr('dy', '0.25em')
      .attr('text-anchor', 'left')
      .text(function(d) {
        return d;
      });
  }

}
