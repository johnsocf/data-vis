import {Component, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {ApiService} from "./shared/api.service";
import {Store} from "@ngrx/store";
import {ApplicationState} from "./store/application-state";
import {SOME_CASE_CLIMATE_DATA} from "./store/actions/climate.actions";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {ClimateModel} from "./shared/models/climate.model";
import {
  IndicatorAttributesModel,
  initialIndicatorAttributes
} from "./shared/models/climate/data/items/indicator-attributes-model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Data Vis CSCI 4830';
  private highIncomeCountries;
  private upperMiddleIncomeCountries;
  private lowerMiddleIncomeCountries;
  private lowIncomeCountries;
  private dataModel = {
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

  private climateModelState$: Observable<ClimateModel>;
  private testClimateData$: Observable<IndicatorAttributesModel[]>;
  private climateStateSub: Subscription;

  constructor(
    private apiService: ApiService,
    private store: Store<ApplicationState>
  ) {
    this.testClimateData$ = this.store.select(state => state.climateData.climateIndicatorData.data.education.primaryCompletionRate);
  }

  //init();


  ngOnInit() {
    this.store.dispatch({ type: SOME_CASE_CLIMATE_DATA, payload: [initialIndicatorAttributes]});
    this.populateFileData()
    console.log('data model', this.dataModel);
    this.tempTestFunction();

  }

  ngOnDestroy() {}

  tempTestFunction() {
    const newDataFromEndpoint = this.apiService.httpGet()
      .subscribe(data => {
        //console.log('data from api', data);
      });
  }
  populateFileData() {
    this.populateFromFile('education/primary-completion-rate.json', 'education', 'primaryCompletionRate', 'none');
    this.populateFromFile('education/primary-secondary-enrollment.json', 'education', 'primarySecondaryEnrollment', 'none');
    this.populateFromFile('energy-use/energy-use-per-capita.json', 'energyUse', 'perCapita', 'none');
    this.populateFromFile('energy-use/energy-use-per-gdp.json', 'energyUse', 'perGDP', 'none');
    this.populateFromFile('health/prevalence-underweight-age.json', 'health', 'prevalenceUnderweightAge', 'none');
    this.populateFromFile('renewable-energy/renewable-energy-consumption.json', 'renewableEnergy', 'renewableEnergyConsumption', 'none');
    this.populateFromFile('socio-economic/poverty-headcount-ratio.json', 'socioEconomic', 'povertyHeadcountRatio', 'none');
    this.populateFromFile('weather/av-precip-depth.json', 'weather', 'averagePrecipitationDepth', 'none');
    this.populateFromFile(
      'electricity-production/percentage-based/electrical-production-from-coal-percentage.json',
      'electricityProduction',
      'percentageBased',
      'fromRenewableExcludingHyrdo'
    );
    this.populateFromFile(
      'electricity-production/percentage-based/electricity-production-from-hydroelectric-percentage.json',
      'electricityProduction',
      'percentageBased',
      'hydroElectric'
    );
    this.populateFromFile(
      'electricity-production/percentage-based/electricity-production-from-natural-gas-percentage.json',
      'electricityProduction',
      'percentageBased',
      'naturalGas'
    );
    this.populateFromFile(
      'electricity-production/percentage-based/electricity-production-from-nuclear-percentage.json',
      'electricityProduction',
      'percentageBased',
      'nuclear'
    );
    this.populateFromFile(
      'electricity-production/percentage-based/electricity-production-from-oil-percentage.json',
      'electricityProduction',
      'percentageBased',
      'oil'
    );
    this.populateFromFile(
      'electricity-production/percentage-based/electricity-production-from-renewable-percentage.json',
      'electricityProduction',
      'percentageBased',
      'renewable'
    );
    this.populateFromFile(
      'electricity-production/percentage-based/renewable-electricity-output-percentage.json',
      'electricityProduction',
      'percentageBased',
      'renewableOutput'
    );
    this.populateFromFile(
      'electricity-production/metric/electricity-production-from-renewable-excluding-hydro-percentage-kwh.json',
      'electricityProduction',
      'metricBased',
      'fromRenewableExcludingHyrdo'
    );

}



  populateFromFile(filePath, modelStructure1, modelStructure2, modelStructure3) {
    const jsonUrl = 'assets/json/' + filePath;
    return this.apiService.httpGetFile(jsonUrl)
      .subscribe(data => {
        const derivedAverageSets = this.getDataAverages(data, data[0]['indicatorName'], data[0]['indicatorCode']);
        this.updateLocalModel(derivedAverageSets, modelStructure1, modelStructure2, modelStructure3);

        return derivedAverageSets;
      });
  }

  updateLocalModel(derivedAverageSets, modelStructure1, modelStructure2, modelStructure3) {
    if (modelStructure3 !== 'none') {this.dataModel[modelStructure1][modelStructure2][modelStructure3] = derivedAverageSets;}
    else {this.dataModel[modelStructure1][modelStructure2] = derivedAverageSets;}
  }

  private countryMetaData = this.apiService.httpGetFile('assets/json/api-info/country-categories.json')
  .subscribe(data => {
    this.highIncomeCountries = _.map(_.filter(data, {incomeGroup: "High income"}), 'countryCode');
    this.upperMiddleIncomeCountries = _.map(_.filter(data, {incomeGroup: "Upper middle income"}), 'countryCode');
    this.lowerMiddleIncomeCountries = _.map(_.filter(data, {incomeGroup: "Lower middle income"}), 'countryCode');
    this.lowIncomeCountries = _.map(_.filter(data, {incomeGroup: "Low income"}), 'countryCode');
  });

  private savedDataRenewableEnergyConsumption = this.apiService.httpGetFile('assets/json/renewable-energy/renewable-energy-consumption.json')
  .subscribe(data => {
    const derivedAverageSets = this.getDataAverages(data, data[0]['indicatorName'], data[0]['indicatorCode']);
  });

  getDataAverages(data, indicatorName, indicatorCode) {
  const averageSet = this.buildDataAverages(data, 'general', indicatorName, indicatorCode);
  const highIncomeAverages = this.getHighIncomeSet(data);
  const upperMiddleIncomeAverages = this.getUpperMiddleIncomeSet(data);
  const lowerMiddleIncomeAverages = this.getLowerMiddleIncomeSet(data);
  const lowIncomeAverages = this.getLowIncomeSet(data);
  const averageSetConglomerated = [averageSet, highIncomeAverages, upperMiddleIncomeAverages, lowerMiddleIncomeAverages, lowIncomeAverages]
  return {
    countryData: data,
    averages: averageSetConglomerated
  };
}

  getHighIncomeSet(data) {
    const thisController = this;
    const highIncomeSet = _.filter(data, function(o){ return thisController.highIncomeCountries.includes(o['countryCode'])});
    return this.buildDataAverages(highIncomeSet, 'high income', data[0].indicatorName, data[0].indicatorCode);
  }

  getUpperMiddleIncomeSet(data) {
    const thisController = this;
    const upperMiddleIncomeSet = _.filter(data, function(o){ return thisController.upperMiddleIncomeCountries.includes(o['countryCode'])});
    return this.buildDataAverages(upperMiddleIncomeSet, 'upper middle income', data[0].indicatorName, data[0].indicatorCode);
  }

  getLowerMiddleIncomeSet(data) {
    const thisController = this;
    const lowerMiddleIncomeSet = _.filter(data, function(o){ return thisController.lowerMiddleIncomeCountries.includes(o['countryCode'])});
    //console.log('lower middle income set', lowerMiddleIncomeSet);
    return this.buildDataAverages(lowerMiddleIncomeSet, 'lower middle income', data[0].indicatorName, data[0].indicatorCode);
  }

  getLowIncomeSet(data) {
    const thisController = this;
    const lowIncomeSet = _.filter(data, function(o){ return thisController.lowIncomeCountries.includes(o['countryCode'])});
    return this.buildDataAverages(lowIncomeSet, 'low income', data[0].indicatorName, data[0].indicatorCode);
  }


  buildDataAverages(set, setName, indicatorName, indicatorCode) {
    const totalRow = {};
    const countObjForAvg = {};
    const averageSet = {};
    let countIndexes = 0;
    const controller = this;
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
            _.assign(totalRow, {[key]: controller.precisionRound(total, 2)});
            _.assign(countObjForAvg, {[key]: controller.precisionRound(countIndex, 2)});
            const avgNow =  totalRow[key] / countObjForAvg[key];
            _.assign(averageSet, {[key]: controller.precisionRound(avgNow, 2)});
          }
        }
      });
    });
    _.assign(averageSet, {
      countryName: setName + ' averages',
      countryCode: "AVG",
      indicatorName: indicatorName,
      indicatorCode: indicatorCode,
    });
    return averageSet;
  }
  precisionRound(number, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

}
