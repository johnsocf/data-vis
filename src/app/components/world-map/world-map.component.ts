import {Component, OnInit, ElementRef, NgZone, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  D3Service,
  D3,
  Selection
} from 'd3-ng2-service';
import * as topojson from "topojson-client";
import {worldTopo} from '../../../assets/topojson/world-mini';

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
    this.svg = this.d3.select(this.parentNativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  setJSON() {
    this.svg.append('path', '.graticule')
      .datum(topojson.feature(worldTopo, worldTopo.objects.land))
      .attr('class', 'land')
      .attr('d', this.path);

    this.svg.append('path')
      .datum(topojson.mesh(worldTopo, worldTopo.objects.countries, (a, b)  => {
        console.log('a', a !== b);
        return a !== b;
        }
      ))
      .attr('class', 'boundary')
      .attr('d', this.path);

    console.log('topojson', topojson);
    console.log('topo', worldTopo)
    console.log('topo', topojson.feature(worldTopo, worldTopo.objects.countries))
    console.log('this grat', this.graticule);

    // this.svg.append('path')
    //   .datum(this.graticule)
    //   .attr('class', 'graticule')
    //   .attr('d', this.path);
  }

  setFrame() {
    this.d3.select(self.frameElement).style('height', this.height + 'px');
  }





}

