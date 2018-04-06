import {Component, OnInit, ElementRef, NgZone, Input} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  D3Service,
  D3,
  Selection
} from 'd3-ng2-service';
import * as _ from 'lodash';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  private _dataSet = {};
  private _selectedInitial: any = {};
  private _indicatorName = '';
  private _countryNames = [];
  private _selectedCountry = 'USA';
  private _selectedAverage: any = {};
  private _countryDataSetComplete: any = [];
  private _aggregatedDataCountrySelections: any = []

  @Input()
  set dataSet(data: any) {
    this._dataSet = data;
  }

  @Input()
  set countryNames(data: any) {
    this._countryNames = data;

    this._aggregatedDataCountrySelections = _.filter(this._countryDataSetComplete, d => {
      //console.log('index of', _.indexOf(this._countryNames, d.CountryCode))
      return _.indexOf(this._countryNames, d.countryCode) !== -1;
    })


    if (!!this._indicatorName) {this.update()}

  }

  @Input()
  set selectedInitial(data: any) {
    if (data) {
     //this._countryNames = [data['countrySelection']['countryName']];
      // for each set it will be, in teh update.
      // iterate through selected Initial list.
      this.aggregateDataSelections(data);
      this.update();
    }
    console.log('data on inside', data);
  }

  aggregateDataSelections(data) {

   if (data) {
     const generalAverages = _.find(data.averages, {countryName: "general averages"})
     const countrySelection = _.find(data.countryData, {countryCode: "BWA"})
     this._countryDataSetComplete = data.countryData;
     this._aggregatedDataCountrySelections = _.filter(this._countryDataSetComplete, d => {
       return _.indexOf(this._countryNames, d.countryCode) !== -1;
     })

     console.log('country set', this._aggregatedDataCountrySelections);

     this._selectedInitial = _.clone(countrySelection.data);
     this._selectedAverage = _.clone(generalAverages.data);
     this._indicatorName = countrySelection['indicatorName'];



     //console.log('selected average', this._selectedAverage);
     console.log('this country names', this._countryNames);
   }
  }

  //get selectedInitial(): any { return this._selectedInitial; }

  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  rectData: any;
  lineData: any;
  svg: any;
  g: any;
  xAxisCall: any;
  yAxisCall: any;

  margin = {top: 20, right: 170, bottom: 150, left: 100};
  width: number = 400;
  height: number = 400;
  y: any;
  x: any;
  area: any;
  color: any;
  min: any;
  max: any;
  extent: any;
  yAxisGroup: any;
  xAxisGroup: any;
  yLabel: any;
  xLabel: any;
  timeLabel: any;
  flag: boolean = true;
  valueType: string;
  t: any;
  newData: any;
  filteredData: any;
  time: number = 0;
  legend: any;
  tip: any;
  interval: any;
  buttonText: string = 'Play';
  selectedAttribute: string = 'all';
  minSlider: any;
  maxSlider: any;
  parseTime: any;
  bisectDate: any;
  dataTimeFiltered: any;
  xrange: any;

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

    if (this.parentNativeElement !== null) {
      this.setSVG();
      this.setOrdinalScale();
      this.getCoins();
      this.getRevenuesBuildRectangles();
    }

  }

  onInputChange(sliderEvent) {
    let sliderValue = sliderEvent.value
    console.log('value', sliderValue);
    this.time = sliderValue;
    this.update();
  }

  setMinAndMax() {
    // this.min = this.d3.min(this._selectedInitial, d => {
    //   return d['height'];
    // });
    // this.max = this.d3.max(this._selectedInitial, d => {
    //   return d['height'];
    // })
    // this.extent = this.d3.extent(this._selectedInitial, d => {
    //   return d['height'];
    // })
  }

  scaleBand() {
    this.x = this.d3.scaleLog()
      .range([0, this.width])
      .base(10);
  }

  buildScaleBandDomain() {
    this.x.domain([0, 2019]);
  }

  setOrdinalScale() {
    this.color = this.d3.scaleOrdinal(this.d3.schemeCategory10);
  }

  buildScales() {
    this.y = this.d3.scaleLinear()
      .range([this.height, 0]);
  }

  buildScaleDomain() {
    this.y.domain([0, 90]);
  }


  getRevenuesBuildRectangles() {
    this.http.get<any[]>('../assets/data/coins.json').subscribe(res =>{
      this.lineData = res;
      //this.newData = this.formatData();
      this.buildScales();
      this.scaleBand();
      this.areaLinear();
      // this.generateAxises();
      this.parseTimeFormat();
      //this.formatTime();
      this.bisectDateFormat();
      // this.addLegend();

      //this.addSlider();
      // this.d3.interval(d => {
      //   this.flag = !this.flag;
      // }, 100);

      this.generateLabels();
      //this.resetVis();
      //this.resetVis();

    },error =>{console.log('Error')});
  }

  getCoins() {
    this.http.get<any[]>('../assets/data/coins.json').subscribe(res =>{
      // Prepare and clean data
      let data = res;
      let filteredData = {};
      for (var coin in data) {
        if (!data.hasOwnProperty(coin)) {
          continue;
        }
        filteredData[coin] = data[coin].filter(function(d){
          return !(d["price_usd"] == null)
        })
        filteredData[coin].forEach(function(d){
          d["price_usd"] = +d["price_usd"];
          d["24h_vol"] = +d["24h_vol"];
          d["market_cap"] = +d["market_cap"];
          d["date"] = Date.parse(d["date"])
        });
      }

    },error =>{console.log('Error')});
  }

  // formatTime():string {
  //   this.formatTime = this.d3.timeFormat("%d/%m/%Y");
  // }

  parseTimeFormat() {
    this.parseTime = this.d3.timeParse("%d/%m/%Y");
  }

  bisectDateFormat() {
    this.bisectDate = this.d3.bisector(d => {return d['date'];}).left;
  }

  addSlider() {

    this.extent = this.d3.extent(this.rectData, d => {
      return d['year'];
    })
    console.log('this extent', this.extent);
    this.minSlider = this.extent[0];
    this.maxSlider = this.extent[1];
  }

  step() {
    this.time = (this.time < +this.extent[1]) ? this.time+1 : +this.extent[0]
    this.update();
  }

  playVis() {
    let element = this;
    if  (this.buttonText === 'Play') {
      this.interval = setInterval(() => {this.step();}, 100);
    } else {
      clearInterval(this.interval);
    }

    this.buttonText = (this.buttonText === 'Play') ? 'Pause' : 'Play';
  }

  resetVis() {
    this.time = +this.extent[0];
    this.update();
  }

  setAttribute(value) {
    this.selectedAttribute = value;
    this.update();
  }

  addLegend() {
    this.legend = this.g.append('g')
      .attr('transform', 'translate(' + (this.width + 110) + ',' + (this.height - 40) + ')');

    this._countryNames.forEach((country, i) => {
      let legendRow = this.legend.append('g')
        .attr('transform', 'translate(0, ' + (i * 20) + ')');

      legendRow.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr("class", "legend")
        .attr('fill', this.color(this._countryNames[i + 1]));
      console.log('i', this.color(this._countryNames[i + 1]))

      legendRow.append('text')
        .attr('x', -10)
        .attr('y', 10)
        .attr("class", "legend")
        .attr('text-anchor', 'end')
        .style('text-transform', 'capitalize')
        .text(country);

    });

    let legendRow = this.legend.append('g')
      .attr('transform', 'translate(0, ' + (this._countryNames.length * 20) + ')');

    legendRow.append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr("class", "legend")
      .attr('fill', 'red');

    legendRow.append('text')
      .attr('x', -10)
      .attr('y', 10)
      .attr('text-anchor', 'end')
      .attr("class", "legend")
      .style('text-transform', 'capitalize')
      .text('average');
  }

  areaLinear() {
    this.area = this.d3.scaleLinear()
      .range([25*Math.PI, 1500*Math.PI])
      .domain([2000, 1400000000]);
  }

  formatData() {
    let thisData =  this.rectData.map(function(year){
      let filteredCountries = year["countries"].filter(function(country){
        return (country.income && country.life_exp);
      }).map(function(country){
        country.income = +country.income;
        country.life_exp = +country.life_exp;
        return country;
      });
      return {
        countries: filteredCountries,
        year: +year['year']
      };
    });
    return thisData;


  }

  update() {
    if (this.svg) {
      this.svg.selectAll('path.line').remove();
      this.svg.selectAll(".chart-line").remove();
      this.svg.selectAll(".x-axis").remove();
      this.svg.selectAll(".y-axis").remove();
      this.svg.selectAll(".legend").remove();


      console.log('update');

      this.buildScaleBandDomain();

      this.addTransition();

      //this.dataTimeFilter();



      this.generateAxises();
      this.generateAxisesCalls();
      this.buildRectangles();

      this.buildScaleDomain();
      this.updateLabelText();
      this.addLegend();
    }
  }

  dataTimeFilter() {
    // this.dataTimeFiltered = this._selectedInitial.filter(function(d){
    //   return ((d.date >= sliderValues[0]) && (d.date <= sliderValues[1]))
    // });
  }

  buildTooltips() {
    // Clear old tooltips
    this.d3.select(".focus").remove();
    this.d3.select(".overlay").remove();

    // Tooltip code
    var focus = this.g.append("g")
      .attr("class", "focus")
      .style("display", "none");
    focus.append("line")
      .attr("class", "x-hover-line hover-line")
      .attr("y1", 0)
      .attr("y2", this.height);
    focus.append("line")
      .attr("class", "y-hover-line hover-line")
      .attr("x1", 0)
      .attr("x2", this.width - this.margin.left);
    focus.append("circle")
      .attr("r", 5);
    focus.append("text")
      .attr("x", 15)
      .attr("dy", ".31em");
    this.svg.append("rect")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
      .attr("class", "overlay")
      .attr("width", this.width)
      .attr("height", this.height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", this.mousemove);
  }

  mousemove() {}

  filterBasedOnSelection() {
    const element = this;
    this.filteredData = _.clone(this.newData)
    let filterSet = _.find(this.filteredData, {year: this.time});
    //console.log('filter set', filterSet);
    this.filteredData = filterSet['countries'].filter(d => {
      if (element.selectedAttribute === 'all') {return true;}
      else {
        return d.continent === element.selectedAttribute;
      }
    });

  }

  updateLabelText() {
    //this.yLabel.text(this.valueType);
  }

  addTransition() {
    this.t = this.d3.transition().duration(750);
  }


  generateLabels() {
    this.xLabel = this.g.append("text")
      .attr('class', 'x axis-label')
      .attr('x', this.width/ 2)
      .attr('y', this.height + 50)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .text('Time');

    this.yLabel = this.g.append('text')
      .attr('class', 'y axis-label')
      .attr('x', -(this.height/ 2))
      .attr('y', -60)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text(this._indicatorName);

    // this.timeLabel = this.g.append('text')
    //   .attr('x', this.height - 10)
    //   .attr('y', this.width - 40)
    //   .attr('font-size', '20px')
    //   .attr('text-anchor', 'middle')
    //   .text('1960');
  }

  generateAxises() {
    //console.log('extent', this.d3.extent(this._selectedAverage, function(d) { return d.year; }));
    // console.log('selected average', this._selectedAverage)

    const averageRange = this.d3.extent(this._selectedAverage, d => {
      return d['year'];
    });
    const averageDomain = this.d3.extent(this._selectedAverage, d => d['value']);
    let selectedRange = [];
    let selectedDomain = [];

    _.forEach(this._aggregatedDataCountrySelections, j => {
      var possibleRange = this.d3.extent(j.data, d => {
        return d['year'];
      })
      if (!selectedRange[0] || selectedRange[0] > possibleRange[0]) {
        selectedRange[0] = possibleRange[0];
      }
      if (!selectedRange[1] || selectedRange[1] < possibleRange[1]) {
        selectedRange[1] = possibleRange[1];
      }
      var possibleDomain = this.d3.extent(j.data, d => d['value']);
      if (!selectedDomain[0] || selectedDomain[0] > possibleDomain[0]) {
        selectedDomain[0] = possibleDomain[0];
      }
      if (!selectedDomain[1] || selectedDomain[1] < possibleDomain[1]) {
        selectedDomain[1] = possibleDomain[1];
      }
    })


    const setRangeMin = averageRange[0] < selectedRange[0] ? averageRange[0] : selectedRange[0];
    const setRangeMax = averageRange[1] > selectedRange[1] ? averageRange[1] : selectedRange[1];
    const averageDomainMin = averageDomain[0] < selectedDomain[0] ? averageDomain[0] : selectedDomain[0];
    const averageDomainMax = averageDomain[1] > selectedDomain[1] ? averageDomain[1] : selectedDomain[1];
    this.x.domain([setRangeMin, setRangeMax]);
    this.y.domain([averageDomainMin, averageDomainMax]);
    this.xrange = [setRangeMin, setRangeMax];
    console.log([setRangeMin, setRangeMax])
    console.log([averageDomainMin, averageDomainMax])

    this.xAxisCall = this.d3.axisBottom(this.x)
      .ticks(10)
      .tickPadding(10)
      .tickValues( this.d3.range(this.xrange[0], this.xrange[1], 5))
      // .tickFormat( d => { return d; });
    this.yAxisCall = this.d3.axisLeft(this.y)
      .ticks(6)
      // .tickFormat( d => { return d; });


// Axis groups
    this.xAxisGroup = this.g.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + this.height + ")");
    this.yAxisGroup = this.g.append("g")
      .attr("class", "y-axis")


    this.xAxisGroup.call(this.xAxisCall.scale(this.x));
    this.yAxisGroup.call(this.yAxisCall.scale(this.y));
    this.yLabel.text(this._indicatorName);
    console.log('this x', this.x);
    console.log('this y', this.y)

  }

  generateAxisesCalls() {
    // Generate axes once scales have been set
    this.yAxisGroup.transition(this.t).call(this.yAxisCall.scale(this.y));
    this.xAxisGroup.transition(this.t).call(this.xAxisCall.scale(this.x))
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

    let element = this;
    // data join

    var line = this.d3.line()
      .x(function(d) {
        console.log('d', element.x(d['year']))
        return element.x(d['year']);
      })
      .y(function(d) {
        console.log('d', element.y(d['value']))
        console.log('d', d['value'])
        return element.y(d['value']);
      })
      .curve(element.d3.curveBasis);

    this._aggregatedDataCountrySelections.forEach(function(j) {
      _.forEach(j.data, d => {
        d.year = +d.year;
        d.value = +d.value;
      });
    });

    this._selectedInitial.forEach(function(d) {
      //_.forEach(j.data, d => {
        d.year = +d.year;
        d.value = +d.value;
      //});
    });

    const g = this.g

    _.each(this._aggregatedDataCountrySelections, (set, i) => {
      console.log('set line HERE', line(set.data));

      g.append("path")
        .attr("class", "chart-line")
        .attr("fill", "none")
        .attr("stroke", this.color(this._countryNames[i + 1]))
        .attr("stroke-with", "5px")
        .attr("d", line(set.data));
      console.log('i', i)
      console.log('another color', this.color(this._countryNames[i + 1]))
      //
      // g.append("path")
      //   .attr("class", "line")
      //   .attr("fill", "none")
      //   .attr("stroke", "red")
      //   .attr("stroke-with", "4px")
      //   .attr("d", line(set.data));
    }) ;
    // // Add line to chart
    this.g.append("path")
      .attr("class", "chart-line")
      .attr("fill", "none")
      .attr("stroke", this.color(this._countryNames[0]))
      .attr("stroke-with", "5px")
      .attr("d", line(this._selectedAverage));
    //
    // console.log('another color', this.color(this._countryNames[0]))
    //
    // this.g.append("path")
    //   .attr("class", "line")
    //   .attr("fill", "none")
    //   .attr("stroke", "red")
    //   .attr("stroke-with", "4px")
    //   .attr("d", line(this._selectedAverage));

    //  //exit old elements

  }



}

