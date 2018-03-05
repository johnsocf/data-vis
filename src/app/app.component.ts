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

    let highIncomeCountries;
    let upperMiddleIncomeCountries;
    let lowerMiddleIncomeCountries;
    let lowIncomeCountries

    const newDataFromEndpoint = apiService.httpGet()
      .subscribe(data => {
        //console.log('data from api', data);
      });

    const countryMetaData = apiService.httpGetFile('assets/json/api-info/country-categories.json')
      .subscribe(data => {
        const usObj = _.find(data, {countryCode : 'USA'});
        highIncomeCountries = _.map(_.filter(data, {incomeGroup: "High income"}), 'countryCode');
        upperMiddleIncomeCountries = _.map(_.filter(data, {incomeGroup: "Upper middle income"}), 'countryCode');
        lowerMiddleIncomeCountries = _.map(_.filter(data, {incomeGroup: "Lower middle income"}), 'countryCode');
        lowIncomeCountries = _.map(_.filter(data, {incomeGroup: "Low income"}), 'countryCode');
        console.log('average set high income', highIncomeCountries);
      });

    const savedDataRenewableEnergyConsumption = apiService.httpGetFile('assets/json/renewable-energy/renewable-energy-consumption.json')
      .subscribe(data => {
        getDataAverages(data);
      });

    function getDataAverages(data) {
      const averageSet = buildDataAverages(data);
      const highIncomeAverages = getHighIncomeSet(data);
      const upperMiddleIncomeAverages = getUpperMiddleIncomeSet(data);
      const lowerMiddleIncomeAverages = getLowerMiddleIncomeSet(data);
      const lowIncomeAverages = getLowIncomeSet(data);
      console.log('avg', averageSet)
      console.log('avg high', highIncomeAverages)
      console.log('avg upper middle', upperMiddleIncomeAverages)
      console.log('avg lower middle', lowerMiddleIncomeAverages)
      console.log('avg lower income', lowIncomeAverages)
    }

    function getHighIncomeSet(data) {
      const highIncomeSet = _.filter(data, function(o){ return highIncomeCountries.includes(o['countryCode'])});
      return buildDataAverages(highIncomeSet);
    }

    function getUpperMiddleIncomeSet(data) {
      const upperMiddleIncomeSet = _.filter(data, function(o){ return upperMiddleIncomeCountries.includes(o['countryCode'])});
      return buildDataAverages(upperMiddleIncomeSet);
    }

    function getLowerMiddleIncomeSet(data) {
      const lowerMiddleIncomeSet = _.filter(data, function(o){ return lowerMiddleIncomeCountries.includes(o['countryCode'])});
      console.log('lower middle income set', lowerMiddleIncomeSet);
      return buildDataAverages(lowerMiddleIncomeSet);
    }

    function getLowIncomeSet(data) {
      const lowIncomeSet = _.filter(data, function(o){ return lowIncomeCountries.includes(o['countryCode'])});
      return buildDataAverages(lowIncomeSet);
    }


    function buildDataAverages(set) {
      const totalRow = {};
      const countObjForAvg = {};
      const averageSet = {};
      let countIndexes = 0;
      _.forEach(set, function(countryObj, index) {

        //console.log('country obj', countryObj['countryName'])
       _.forEach(countryObj, function(value, key) {
          if (!isNaN(parseInt(key))) {

            let newValue = parseInt(value);
            let valueSum;

            // if data entry has a value
            if (!isNaN(newValue) && (newValue !== 0)) {
              // set index to 1 on counter or get value of count if one exists
              countIndexes = !isNaN(parseInt(countObjForAvg[key])) ? parseInt(countObjForAvg[key]) : 0;
              if (countIndexes === 0) {
                valueSum = 0;
              } else {
                valueSum = !isNaN(parseInt(totalRow[key])) ? parseInt(totalRow[key]) : 0;
              }

              console.log('country', countryObj.countryName);
              console.log('value sum', valueSum);
              console.log('value', value)


              const total = (newValue + valueSum);
              const countIndex = countIndexes + 1;
              _.assign(totalRow, {[key]: precisionRound(total, 2)});
              _.assign(countObjForAvg, {[key]: precisionRound(countIndex, 2)});
              const avgNow =  totalRow[key] / countObjForAvg[key];
              _.assign(averageSet, {[key]: precisionRound(avgNow, 2)});
            }


          }
        });
      });
      function precisionRound(number, precision) {
        const factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
      }
      // console.log('NEW ROW!!!', totalRow);
      // console.log('NEW ROW!!!', countObjForAvg);
      // console.log('NEW ROW!!!', averageSet);
      return averageSet;
    }


  }
}
