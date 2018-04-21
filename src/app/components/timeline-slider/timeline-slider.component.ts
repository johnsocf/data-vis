import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-timeline-slider',
  templateUrl: './timeline-slider.component.html',
  styleUrls: ['./timeline-slider.component.css']
})
export class TimelineSliderComponent implements OnInit {
  time: any;
  @Output() change: EventEmitter<any> = new EventEmitter();
  minSlider: number = 1960;
  maxSlider: number = 2018;

  constructor() { }

  ngOnInit() {
  }

  onInputChange(sliderEvent) {
    let sliderValue = sliderEvent.value;
    this.time = sliderValue;
    this.change.emit(sliderValue);
  }

}
