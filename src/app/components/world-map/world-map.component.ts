import {Component, OnInit, ElementRef, NgZone, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  D3Service,
  D3,
  Selection
} from 'd3-ng2-service';
import * as topojson from "topojson-client";
import {topo as worldTopo} from '../../../assets/topojson/world-topo';
import { worldCode as topoWorld } from '../../../assets/topojson/world-code';
import * as _ from 'lodash';
import {ApplicationState} from "../../store/application-state";
import {Store} from "@ngrx/store";
import {UPDATE_COUNTRIES_SELECTION} from "../../store/actions/ui.actions";
import {countryMap} from '../../../assets/maps/country-maps';

@Component({
  selector: 'app-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.css']
})

export class WorldMapComponent implements OnInit {
  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  svg: any;width: number = 1000;
  height: number = 400;
  ////
  projection: any;
  path: any;
  graticule: any;
  land: any;
  countryCodes: any = [];
  color: any;

  constructor(
    element: ElementRef,
    private ngZone: NgZone,
    d3Service: D3Service,
    private http: HttpClient,
    private store: Store<ApplicationState>
  ) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    this.setProjection();
    this.setSVG();
    this.setOrdinalScale();
    this.setJSON();
    this.setFrame();
  }

  setProjection() {
    this.projection = this.d3.geoMercator()
      .scale(153)
      .translate([this.width/ 2, this.height / 2])
      .precision(.1);

    this.path = this.d3.geoPath()
      .projection(this.projection);

    this.graticule = this.d3.geoGraticule();
  }

  setOrdinalScale() {
    this.color = this.d3.scaleOrdinal(this.d3.schemeCategory10);
  }

  setSVG() {
    let d3 = this.d3
    this.svg = this.d3.select(this.parentNativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
        .on('mousedown', d => {
          d3.event.preventDefault();

      })
  }

  setJSON() {
    // this.svg.append('path', '.graticule')
    //   .datum(topojson.feature(topoWorld, topoWorld.objects.countries))
    //   .attr('class', 'land')
    //   .attr('id', function(d) {
    //     console.log('TOPO-JSON', worldTopo);
    //     console.log('d', d)
    //     return d.country_code;
    //   })
    //   .attr('d', this.path)
    //   .on('click', d => {
    //     console.log('clicked 2!', d);
    //     console.log('this',  this);
    //   });
    const features = topoWorld.objects.countries.geometries
      .map(
        function(g) {
          return topojson.feature(topoWorld, g);
        }
      );
    // const properties = worldTopo.objects.countries.properties
    //   .map(
    //     function(g) {
    //       return topojson.feature(worldTopo, g);
    //     }
    //   );
    const d3 = this.d3;
    const countryCodes = this.countryCodes;
    const store = this.store;
    const classContext = this;
    this.svg.selectAll('.countries')
      .data(features)
      .enter()
      .append('path')
      .attr('class', 'state')
      .attr('d', this.path)
      .style('fill', '#384048')
      .on('click', function (d) {
        let countryCode = d.properties.countryCode;
        let countryConversion = classContext.updateLocalCountrySetToGetColor(countryCode, classContext);
        store.dispatch({ type: 'UPDATE_COUNTRIES_SELECTION', payload: countryCode});
        const index = _.indexOf(classContext.countryCodes, countryConversion);
        console.log('color',  countryConversion)
        console.log('color',  classContext.color(countryConversion))

        let selected = d3.select(this).classed('selected')
          d3.select(this).classed('selected', selected ? false : true);
          let fillStyle = !selected ?  classContext.color(countryConversion) : '#384048';
          d3.select(this).style('fill', fillStyle);


        });

    this.svg.selectAll('path')
      .data(topojson.feature(topoWorld, topoWorld.objects.countries))
      .enter().append('path')
      .attr('class', 'state-boundary')
      .attr('id', function(d) {
        return d.country_code;
      })
      .attr('d', this.path)
      .style('fill', 'red')
      .on('click', function (d) {
        console.log('big d', d);
      });


    this.svg.append('path')
      .datum(topojson.mesh(worldTopo, worldTopo.objects.countries, (a, b)  => {
        return a !== b;
        }
      ))
      .attr('class', 'boundary')
      .attr('d', this.path)


    // this.svg.append('g')
    //   .attr('class', 'boundary')
    //   .selectAll('boundary')
    //   .data(topojson.feature(worldTopo, worldTopo.objects.countries))
    //   .enter().append('path')
    //   .on('click', d => {
    //     console.log('clicked 2!', d);
    //     console.log('this',  this);
    //   })
    //   .attr('d', this.path);

    // this.svg.selectAll('boundary')
    //   .on('mousedown', d => {
    //     console.log('clicked 2!')
    //   })

    // this.svg.append('path')
    //   .datum(this.graticule)
    //   .attr('class', 'graticule')
    //   .attr('d', this.path);
  }

  updateLocalCountrySetToGetColor(countryCode, context) {
    const alpha3_conversion_object = _.find(countryMap, {'alpha-2': countryCode});
    const alpha3_conversion = alpha3_conversion_object['alpha-3'];
    const countryCodeSelected = _.includes(this.countryCodes, alpha3_conversion);
    countryCodeSelected ? _.pull(this.countryCodes, alpha3_conversion) : this.countryCodes.push(alpha3_conversion);

    let newObj = _.zipObject(this.countryCodes, _.map(this.countryCodes, d => {
      return this.color(d)
    }));
    this.store.dispatch({ type: 'UPDATE_COLOR_MAP', payload: newObj});
    console.log('new obj', newObj);

    return alpha3_conversion
  }

  setFrame() {
    this.d3.select(self.frameElement).style('height', this.height + 'px');
  }





}

