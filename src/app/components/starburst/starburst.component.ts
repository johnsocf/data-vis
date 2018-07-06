import {Component, OnInit, ElementRef, NgZone, Input, ChangeDetectorRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  D3Service,
  D3,
  Selection,
  Transition
} from 'd3-ng2-service';
import * as _ from 'lodash';
import {
  colorSet20b, colorSetRed, colorSetGreen, colorSetBlue,
  redSetComplimentWhiteText, blueSetComplimentWhiteText, greenSetComplimentWhiteText} from '../../../assets/colorSets/color-set';
import {electricityChildren, emissionsChildren, populationChildren} from '../../../assets/colorSets/color-legend';
import {legendMap} from '../../../assets/colorSets/legend-map';

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
  breadcrumbs;
  lastCrumb;
  selectedSet;
  selectedCountry;


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
  margin = {top: 40, right: 40, bottom: 60, left: 120};
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
  selectedValue: string;
  totalLegendKey: any;
  showStarburst = false;

  b = {
    w: 60,
    h: 30,
    s: 3,
    t: 10
  };

  li = {
    w: 75,
    h: 30,
    s: 3,
    r: 3
  };

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
      .startAngle(d =>  { return Math.max(0, Math.min(2 * Math.PI, this.x(d['x0']))); })
      .endAngle(d =>  { return Math.max(0, Math.min(2 * Math.PI, this.x(d['x1']))); })
      .innerRadius(d =>  {return Math.max(0, this.y(d['y0'])); })
      .outerRadius(d => { return Math.max(0, this.y(d['y1'])); });
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
          let parentElem = d.data.name;
          classObj.selectedName = parentElem;
          console.log('selected value', d);
          classObj.selectedValue = d.value;
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
              classObj.d3.select(this.parentNode).select('text')

              //let allText = classObj.d3.selectAll('.text-node').attr('display', 'none');
              // let rotateValue = ((classObj.x((d.x0 + d.x1)/2) - Math.PI / 2) / Math.PI * 180);
              // let reverse = false;
              // if ((rotateValue > 100) || (rotateValue < -90)) {
              //   reverse = true;
              // }
              // fade in the text element and recalculate positions
              .transition().duration(750)
                //.attr('opacity', 1)
                //.attr('class', 'visible')
                .attr('transform', d => {
                  let rotateValue = ((classObj.x((d['x0'] + d['x1'])/2) - Math.PI / 2) / Math.PI * 180);
                  //console.log('rotateValue', rotateValue)
                  return 'rotate(' +  ((classObj.x((d['x0'] + d['x1'])/2) - Math.PI / 2) / Math.PI * 180) + ')'
                })
                .attr('x', d => { return classObj.y(d['y0']); })
                .style('display', d => {
                  //console.log('d', d);
                  if (d['parent']['data']['name'] === parentElem && !d['children'] && d['data']['name'] !== 'weather') {
                  //if (!d.children) {
                    return 'block';
                  }
                  return 'none';
                })
                .text(d => {
                  const thisText = d['data']['name'];
                  const needsMapping = _.find(legendMap, j => {
                    const trimmed = j.name.replace(/\s/g, '');
                    return trimmed.includes(thisText.replace(/\s/g, ''));
                  });
                  let displayName = '';
                  if (needsMapping) {
                    displayName = needsMapping.legendMap;
                  } else {
                    displayName = d['data']['name'];
                  }

                  return displayName;
                });
            } else {
              const arcText = classObj.d3.select(this.parentNode).select('text');

              arcText.transition().duration(750)
                //.attr('opacity', 0)
                .style('display', d => {
                  //console.log('d', d);
                  // if (classObj.totalLegendKey.includes(d.data.name) && d.data.name !== 'weather') {
                  //   return 'block';
                  // }
                  return 'none';
                })
                .text(d => {
                  return d['data']['name'] === 'root' ? '' : d['data']['name'];
                });
            }
          });
      });

    // const parentElem = d.data.name;
    // console.log('hovered', d);
    // const nodes = this.flatten(root);
    // const n = nodes.find(d1 => {
    //   return (d1.name === parentElem);
    // })

     this.svg.selectAll('.starburst-path').attr('opacity', 1).on('mouseover', d => {
       const ancestors = this.getAncestors(d);
        this.svg.selectAll('.starburst-path')
          .attr('opacity', 0.3);
       this.svg.selectAll('.starburst-path')
          .filter(function(node) {
            return (ancestors.indexOf(node) >= 0);
          })
          .attr('opacity', 1);
        this.mouseOver(d);
        let timer;
        if (!timer) {
          //timer = setTimeout(this.updateBreadcrumbs(ancestors, d.value, this), 1);
          console.log('hover data', d);
          if (d.depth == 3) {
            classObj.selectedSet = d.parent.data.name;
            classObj.selectedCountry = d.parent.parent.data.name;
            classObj.selectedName = d.data.name;
            if (d.value < 10 && d.value >= 0) {
              classObj.selectedValue = d.value;
            } else {
              classObj.selectedValue = '';
            }
          }
          if (d.depth == 2) {
            classObj.selectedSet = d.data.name;
            classObj.selectedCountry = d.parent.data.name;
            classObj.selectedName = '';
            classObj.selectedValue = '';
          }
          if (d.depth == 1) {
            classObj.selectedCountry = d.data.name;
            classObj.selectedSet = '';
            classObj.selectedName = '';
            classObj.selectedValue = '';
          }

        }

        //this.updateBreadcrumbs(ancestors, d.data.value);
        //this.d3.select(this).style('cursor', 'pointer')

      })
      .on('mouseout', d => {
        this.svg.selectAll('.starburst-path')
          .attr('opacity', 1);
        //console.log('mouse out', d);
        this.d3.select('.breadcrumb-svg').remove();

      });

    this.text = this.g.append('text')
      .attr('class', 'text-node')
      .attr('transform', d => {return 'rotate(' + ((this.x((d.x0 + d.x1)/2) - Math.PI / 2) / Math.PI * 180) + ')'})
      .attr('x', d => { return this.y(d.y0); })
      .attr('dx', '6') // margin
      .attr('dy', '.35em') // vertical-align
      .style('display','none')
      .style('fill', d => {
        let fillColor = '#000000';
        if ('flare' == d.data.name) {
          return '#000000';
        }
        if (electricityChildren.includes(d.data.name)) {
          const color = this.colorReds(d.data.name);
          if (redSetComplimentWhiteText.includes(color)) {
            fillColor = '#FFFFFF';
          }
        } else if (emissionsChildren.includes(d.data.name)) {
          const color = this.colorGreens(d.data.name);
          if (greenSetComplimentWhiteText.includes(color)) {
            fillColor = '#FFFFFF';
          }
        } else if (populationChildren.includes(d.data.name)) {
          const color = this.colorBlues(d.data.name);
          if (blueSetComplimentWhiteText.includes(color)) {
            fillColor = '#FFFFFF';
          }
        }
        return fillColor;
      })
      .text(function(d) {
        const thisText = d.data.name;
        const needsMapping = _.find(legendMap, j => {
          const trimmed = j.name.replace(/\s/g, '');
          return trimmed.includes(thisText.replace(/\s/g, ''));
        });
        let displayName = '';
        if (needsMapping) {
          displayName = needsMapping.legendMap;
        } else {
          displayName = d.data.name;
        }
        return displayName;
      });
  }

  breadcrumbPoints(d, i) {
    let b = {
      w: 100,
      h: 30,
      s: 3,
      t: 10
    }
    var points = [];
    points.push('0,0');
    points.push(b.w + ',0');
    points.push(b.w + b.t + ',' + (b.h / 2));
    points.push(b.w + ',' + b.h);
    points.push('0,' + b.h);

    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
      points.push(b.t + ',' + (b.h / 2));
    }
    return points.join(' ');
  }

  updateBreadcrumbs(ancestors, value, context) {
    let classObj = context;
    classObj.drawBreadCrumbs();
    let b = {
      w: 60,
      h: 30,
      s: 3,
      t: 10
    };

    let g = classObj.breadcrumbs.selectAll('g')
      .data(ancestors);
    let breadcrumb = g.enter().append('g');

    breadcrumb
      .append('polygon').classed('breadcrumbs-shape', true)
      .attr('points', classObj.breadcrumbPoints)
      .attr('class', 'crumb')
      .attr('fill', d => {
        if ('flare' == d.data.name) {
          return '#000000';
        }
        if (d.children && classObj._countryNames.includes(d.data.name)) {
          return classObj.color(d.data.name);
        }
        if (electricityChildren.includes(d.data.name)) {
          return classObj.colorReds(d.data.name);
        } else if (emissionsChildren.includes(d.data.name)) {
          return classObj.colorGreens(d.data.name);
        } else if (populationChildren.includes(d.data.name)) {
          return classObj.colorBlues(d.data.name);
        }
        return '#BADA55';

      })


    breadcrumb
      .append('text').classed('breadcrumbs-text', true)
      .attr('x', (b.w + b.t) / 2)
      .attr('y', b.h / 2)
      .attr('dy', '0.35em')
      .attr('font-size', '10px')
      .attr('text-anchor', 'left')
      .text(function(d) {
        const thisText = d.data.name;
        const needsMapping = _.find(legendMap, j => {
          const trimmed = j.name.replace(/\s/g, '');
          return trimmed.includes(thisText.replace(/\s/g, ''));
        });
        let displayName = '';
        if (needsMapping) {
          displayName = needsMapping.legendMap;
        } else {
          displayName = d.data.name;
        }

        return displayName;
      });

    // Set position for entering and updating nodes.
    g.attr('class', 'g-crumb').attr('transform', function(d, i) {
      console.log('transform i', d);
      if (this._countryNames.includes(d)) {

        return 'translate(' + 0 * (b.w + b.s) + ', 0)';
      }
      if (['emissions', 'population', 'electricityProduction'].includes(d)) {
        return 'translate(' + 1 * (b.w + b.s) + ', 0)';
      }
      return 'translate(' + 2 * (b.w + b.s) + ', 0)';
    });

    // Remove exiting nodes.
    g.exit().remove();

    // Update percentage at the lastCrumb.
    this.lastCrumb
      .attr('x', (ancestors.length + 0.5) * (b.w + b.s))
      .attr('y', b.h / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'left')
      .attr('fill', 'black')
      .attr('font-weight', 600)
      .text(d => {
        if (value < 10 && value >= 0) {
          classObj.selectedValue = value;
        } else {
          classObj.selectedValue = '';
        }
      });
  }

  mouseOver(n) {
    //console.log('test', n.data);
  }

  flatten(root) {
    let nodes = [],
      i = 0;

    function recurse(node) {
      if (node.children) {node.children.forEach(recurse)};
      if (!node.id) {node.id = ++i};
      nodes.push(node);
    }

    recurse(root);
    return nodes;
  }

  getAncestors(node) {
    var path = [];
    var current = node;

    while (current.parent) {
      path.unshift(current);
      current = current.parent;
    }
    return path;
  }

  setSVG() {
    this.svg = this.d3.select('#starburst-canvas')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + ((this.width + this.margin.left + this.margin.right) / 2) + ',' + ((this.height + this.margin.top + this.margin.bottom) / 2 + 10) + ')');
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
      this.showStarburst = true;
      this.svg.selectAll('path.line').remove();
      this.svg.selectAll('path').remove();
      this.svg.selectAll('g').remove();
      this.svg.selectAll('text').remove();
      this.d3.select('#legend-svg').remove();
      this.d3.select('.breadcrumb-svg').remove();
      this.selectedName = '';

      this.setOrdinalScale();
      this.buildXYScales();
      this.partitionAdd();
      this.arcFunction();
      this.buildStarburst();
      this.drawLegend();
      this.drawBreadCrumbs();
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
      w: 75, h: 27, s: 3, r: 3
    };

    const legend = this.d3.select('#legend').append('svg:svg')
      .attr('id', 'legend-svg')
      .attr('width', '600px')
      .attr('height', d => {
        return this.totalLegendKey.length * (li.h + li.s);
      });
    let objElement = this;

    let classObj = this;
    let g = legend.selectAll('g')
      .attr('id', 'legend')
      .data(this.totalLegendKey)
      .enter().append('svg:g').attr('class', 'legend-text')
      .attr('transform', function(d, i) {
        console.log('d', d);
        if (['emissions', 'population', 'electricityProduction'].includes(d.toString())) {
          return 'translate(0,' + i * (li.h + li.s) + ')';
        }
        return 'translate(25,' + i * (li.h + li.s) + ')';
      });

    g.append('svg:rect')
      .attr('rx', li.r)
      .attr('ry', li.r)
      .attr('width', d => {
        return 700;
      })
      .attr('height', li.h)
      .style('fill', d => {
        //console.log('legend d', d);
        if ('flare' == d) {
          return '#FFFFFF';
        }
        if (electricityChildren.includes(d.toString())) {
          return this.colorReds(d);
        } else if (emissionsChildren.includes(d.toString())) {
          return this.colorGreens(d);
        } else if (populationChildren.includes(d.toString())) {
          return this.colorBlues(d);
        }
        return '#BADA55';
      })

    g.append('svg:text')
      .attr('width', d => {
        return d['length'] * 9;
      })
      .attr('class', 'legend-text')
      .attr('y', li.h / 2)
      .attr('dy', '0.19em')
      .attr('text-anchor', 'left')
      .attr('x', 14)
      .style('font-family', 'Courier New')
      .style('fill', d => {
        let fillColor = '#000000';
        if (electricityChildren.includes(d.toString())) {
          const color = this.colorReds(d);
          if (redSetComplimentWhiteText.includes(color)) {
            fillColor = '#FFFFFF';
          }
        } else if (emissionsChildren.includes(d.toString())) {
          const color = this.colorGreens(d);
          if (greenSetComplimentWhiteText.includes(color)) {
            fillColor = '#FFFFFF';
          }
        } else if (populationChildren.includes(d.toString())) {
          const color = this.colorBlues(d);
          if (blueSetComplimentWhiteText.includes(color)) {
            fillColor = '#FFFFFF';
          }
        }
        return fillColor;
      })
      .text(function(d) {
        return d.toString();
      });
  }

  drawBreadCrumbs() {
    let classObj = this;
     this.breadcrumbs = this.d3.select('#breadcrumbs').append('svg:svg')
      .attr('class', 'breadcrumb-svg')
      .attr('width', '600px')
      .attr('height', '70px');
    this.lastCrumb = this.breadcrumbs
      .append('text').classed('lastCrumb', true);
  }

}
