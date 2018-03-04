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
    const savedData = apiService.httpGetFile('assets/json/renewable-energy/renewable-energy-consumption.json')
      .subscribe(data => {
        console.log('saved data', data);
        const usObj = _.find(data, {countryCode : 'USA'});
        buildDataAverages(data);
        console.log('usObj', usObj);
      });

    function buildDataAverages(set) {
      const totalRow = {};
      const countObjForAvg = {};
      const averageSet = {};
      let countIndexes = 0;
      _.forEach(set, function(countryObj, index) {

        console.log('country obj', countryObj['countryName'])
       _.forEach(countryObj, function(value, key) {
          if (!isNaN(parseInt(key))) {

            let newValue = parseInt(value);
            let valueSum;
            countIndexes = !isNaN(parseInt(countObjForAvg[key])) ? parseInt(countObjForAvg[key]) : 0;
            console.log('count obj current', parseInt(countObjForAvg[key]))
            if (countIndexes === 0) {
              valueSum = 0;
            } else {
              valueSum = isNaN(parseInt(totalRow[key])) ? parseInt(totalRow[key]) : 0;

            }



            if (!isNaN(newValue) && (newValue !== 0)) {
             // countIndexes = countIndexes + 1;


              if (key == '1990.00') {
                console.log('value sum', valueSum);
                console.log('new value', newValue);
                console.log('index', countIndexes);
              }


              let total = (newValue + valueSum);
              let countIndex = countIndexes + 1;
              console.log('index2', countIndex);
              let calculatedAverage = (newValue + valueSum) / countIndexes;
              //console.log('calculatedAverage', calculatedAverage);
              _.assign(totalRow, {[key]: precisionRound(total, 2)});
              _.assign(countObjForAvg, {[key]: precisionRound(countIndex, 2)});
              console.log('count obj', countObjForAvg);
              //_.assign(averageSet, {[key]: precisionRound(calculatedAverage, 2)});
            }


          }
        });
      });
      function precisionRound(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
      }
      console.log('NEW ROW!!!', totalRow);
      console.log('NEW ROW!!!', countObjForAvg);
      console.log('NEW ROW!!!', averageSet);
    }


  }
}
