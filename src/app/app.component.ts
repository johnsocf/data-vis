import { Component } from '@angular/core';
import * as _ from 'lodash';
import {ApiService} from "./shared/api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Data Vis CSCI 4830';
  constructor(private apiService: ApiService) {
    const newData = apiService.httpGet()
      .subscribe(data => {
        console.log('data', data);
      });
    console.log('new data', newData);
    const savedData = apiService.httpGetFile('data/json/renewable-energy/renewable-energy-consumption.json')
      .subscribe(data => {
        console.log('saved data', data);
      });

  }
}
