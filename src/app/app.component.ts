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
    let lowIncomeCountries;
    let dataModel = {
      education: {
        primaryCompletionRate: {},
        primarySecondaryEnrollment: {}
      },
      electricityProduction: {
        percentageBased: {
          coal: {},
          hydroElectric: {},
          naturalGas: {},
          nuclear: {},
          oil: {},
          renewable: {},
          renewableOutput: {}
        },
        metricBased: {
          fromRenewableExcludingHyrdo: {}
        }
      },
      emissions: {
        percentageBased: {},
        metricBased: {}
      },
      energyUse: {
        perCapita: {},
        perGDP: {}
      },
      health: {
        prevalenceUnderweightAge: {}
      },
      population: {
        percentageBased: {},
        metricBased: {}
      },
      renewableEnergy: {
        renewableEnergyConsumption: {}
      },
      socioEconomic: {
        povertyHeadcountRatio: {}
      },
      weather: {
        averagePrecipitationDepth: {}
      }
    };

    init();

    const newDataFromEndpoint = apiService.httpGet()
      .subscribe(data => {
        //console.log('data from api', data);
      });

    function init() {
      populateFromFile('education/primary-completion-rate.json', 'education', 'primaryCompletionRate', 'none');
      populateFromFile('education/primary-secondary-enrollment.json', 'education', 'primarySecondaryEnrollment', 'none');
      populateFromFile('energy-use/energy-use-per-capita.json', 'energyUse', 'perCapita', 'none');
      populateFromFile('energy-use/energy-use-per-gdp.json', 'energyUse', 'perGDP', 'none');
      populateFromFile('health/prevalence-underweight-age.json', 'health', 'prevalenceUnderweightAge', 'none');
      populateFromFile('renewable-energy/renewable-energy-consumption.json', 'renewableEnergy', 'renewableEnergyConsumption', 'none');
      populateFromFile('socio-economic/poverty-headcount-ratio.json', 'socioEconomic', 'povertyHeadcountRatio', 'none');
      populateFromFile('weather/av-precip-depth.json', 'weather', 'averagePrecipitationDepth', 'none');

      populateFromFile(
        'electricity-production/percentage-based/electrical-production-from-coal-percentage.json',
        'electricityProduction',
        'percentageBased',
        'fromRenewableExcludingHyrdo'
      );

      populateFromFile(
        'electricity-production/percentage-based/electricity-production-from-hydroelectric-percentage.json',
        'electricityProduction',
        'percentageBased',
        'hydroElectric'
      );

      populateFromFile(
        'electricity-production/percentage-based/electricity-production-from-natural-gas-percentage.json',
        'electricityProduction',
        'percentageBased',
        'naturalGas'
      );

      populateFromFile(
        'electricity-production/percentage-based/electricity-production-from-nuclear-percentage.json',
        'electricityProduction',
        'percentageBased',
        'nuclear'
      );

      populateFromFile(
        'electricity-production/percentage-based/electricity-production-from-oil-percentage.json',
        'electricityProduction',
        'percentageBased',
        'oil'
      );

      populateFromFile(
        'electricity-production/percentage-based/electricity-production-from-renewable-percentage.json',
        'electricityProduction',
        'percentageBased',
        'renewable'
      );

      populateFromFile(
        'electricity-production/percentage-based/renewable-electricity-output-percentage.json',
        'electricityProduction',
        'percentageBased',
        'renewableOutput'
      );

      populateFromFile(
        'electricity-production/metric/electricity-production-from-renewable-excluding-hydro-percentage-kwh.json',
        'electricityProduction',
        'metricBased',
        'fromRenewableExcludingHyrdo'
      );


      console.log('data model', dataModel);
    }



    function populateFromFile(filePath, modelStructure1, modelStructure2, modelStructure3) {
      const jsonUrl = 'assets/json/' + filePath;
      return apiService.httpGetFile(jsonUrl)
        .subscribe(data => {
          const derivedAverageSets = getDataAverages(data, data[0]['indicatorName'], data[0]['indicatorCode']);
          if (modelStructure3 !== 'none') {dataModel[modelStructure1][modelStructure2][modelStructure3] = derivedAverageSets;}
          else {dataModel[modelStructure1][modelStructure2] = derivedAverageSets;}
          return derivedAverageSets;
        });
    }

    const countryMetaData = apiService.httpGetFile('assets/json/api-info/country-categories.json')
      .subscribe(data => {
        highIncomeCountries = _.map(_.filter(data, {incomeGroup: "High income"}), 'countryCode');
        upperMiddleIncomeCountries = _.map(_.filter(data, {incomeGroup: "Upper middle income"}), 'countryCode');
        lowerMiddleIncomeCountries = _.map(_.filter(data, {incomeGroup: "Lower middle income"}), 'countryCode');
        lowIncomeCountries = _.map(_.filter(data, {incomeGroup: "Low income"}), 'countryCode');
      });

    const savedDataRenewableEnergyConsumption = apiService.httpGetFile('assets/json/renewable-energy/renewable-energy-consumption.json')
      .subscribe(data => {
        const derivedAverageSets = getDataAverages(data, data[0]['indicatorName'], data[0]['indicatorCode']);
      });

    function getDataAverages(data, indicatorName, indicatorCode) {
      const averageSet = buildDataAverages(data, 'general', indicatorName, indicatorCode);
      const highIncomeAverages = getHighIncomeSet(data);
      const upperMiddleIncomeAverages = getUpperMiddleIncomeSet(data);
      const lowerMiddleIncomeAverages = getLowerMiddleIncomeSet(data);
      const lowIncomeAverages = getLowIncomeSet(data);
      const averageSetConglomerated = [averageSet, highIncomeAverages, upperMiddleIncomeAverages, lowerMiddleIncomeAverages, lowIncomeAverages]
      return {
        countryData: data,
        averages: averageSetConglomerated
      };
    }

    function getHighIncomeSet(data) {
      const highIncomeSet = _.filter(data, function(o){ return highIncomeCountries.includes(o['countryCode'])});
      return buildDataAverages(highIncomeSet, 'high income', data[0].indicatorName, data[0].indicatorCode);
    }

    function getUpperMiddleIncomeSet(data) {
      const upperMiddleIncomeSet = _.filter(data, function(o){ return upperMiddleIncomeCountries.includes(o['countryCode'])});
      return buildDataAverages(upperMiddleIncomeSet, 'upper middle income', data[0].indicatorName, data[0].indicatorCode);
    }

    function getLowerMiddleIncomeSet(data) {
      const lowerMiddleIncomeSet = _.filter(data, function(o){ return lowerMiddleIncomeCountries.includes(o['countryCode'])});
      //console.log('lower middle income set', lowerMiddleIncomeSet);
      return buildDataAverages(lowerMiddleIncomeSet, 'lower middle income', data[0].indicatorName, data[0].indicatorCode);
    }

    function getLowIncomeSet(data) {
      const lowIncomeSet = _.filter(data, function(o){ return lowIncomeCountries.includes(o['countryCode'])});
      return buildDataAverages(lowIncomeSet, 'low income', data[0].indicatorName, data[0].indicatorCode);
    }


    function buildDataAverages(set, setName, indicatorName, indicatorCode) {
      const totalRow = {};
      const countObjForAvg = {};
      const averageSet = {};
      let countIndexes = 0;
      _.forEach(set, function(countryObj) {

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
      _.assign(averageSet, {
        countryName: setName + ' averages',
        countryCode: "AVG",
        indicatorName: indicatorName,
        indicatorCode: indicatorCode,
      });
      return averageSet;
    }


  }
}
