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

  constructor(
    element: ElementRef,
    private ngZone: NgZone,
    d3Service: D3Service,
    private http: HttpClient,
  ) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    this.setProjection();
    this.setSVG();
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

  setSVG() {
    let d3 = this.d3
    this.svg = this.d3.select(this.parentNativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
        .on('mousedown', d => {
          d3.event.preventDefault();
          console.log('clicked 1!');
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
    const features = worldTopo.objects.countries.geometries
      .map(
        function(g) {
          return topojson.feature(worldTopo, g);
        }
      );
    this.svg.selectAll('.countries')
      .data(features)
      .enter()
      .append('path')
      .attr('class', 'state')
      .attr('d', this.path)
      .style('fill', 'red')
      .on('click', function (d) {
          console.log('big d', d);
        });

    this.svg.selectAll('path')
      .data(topojson.feature(topoWorld, topoWorld.objects.countries))
      .enter().append('path')
      .attr('class', 'state-boundary')
      .attr('id', function(d) {
        console.log('TOPO-JSON d', worldTopo);
        console.log('d ddd', d)
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

  setFrame() {
    this.d3.select(self.frameElement).style('height', this.height + 'px');
  }





}

