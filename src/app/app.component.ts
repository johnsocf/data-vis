import {Component, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {ApiService} from "./shared/api.service";
import {Store} from "@ngrx/store";
import {ApplicationState} from "./store/application-state";
import {
  ADD_EDUCATION_DATA_PRIMARY_COMPLETION,
  ADD_EDUCATION_DATA_SECONDARY,
  ADD_ELECTRICITY_PRODUCTION_DATA_METRIC_FROM_RENEWABLE_EXCLUDING_HYDRO,
  ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_COAL,
  ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_HYDROELECTRIC,
  ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_NATURAL_GAS,
  ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_NUCLEAR, ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_OIL,
  ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_RENEWABLE,
  ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_RENEWABLE_OUTPUT, ADD_EMISSIONS_DATA_METRIC_CO2,
  ADD_EMISSIONS_DATA_METRIC_HFC, ADD_EMISSIONS_DATA_METRIC_METHANE, ADD_EMISSIONS_DATA_METRIC_NITROUS_OXIDE,
  ADD_EMISSIONS_DATA_METRIC_OTHER_GREENHOUSE,
  ADD_EMISSIONS_DATA_METRIC_PVC,
  ADD_EMISSIONS_DATA_METRIC_SF6,
  ADD_EMISSIONS_DATA_METRIC_TOTAL, ADD_EMISSIONS_DATA_PERCENTAGE_CO2_GAS, ADD_EMISSIONS_DATA_PERCENTAGE_CO2_SOLID,
  ADD_EMISSIONS_DATA_PERCENTAGE_METHANE, ADD_EMISSIONS_DATA_PERCENTAGE_NITROUS_OXIDE,
  ADD_EMISSIONS_DATA_PERCENTAGE_OTHER_GREENHOUSE,
  ADD_EMISSIONS_DATA_PERCENTAGE_TOTAL_GREENHOUSE,
  ADD_ENERGY_USE_DATA_PER_CAPITA,
  ADD_ENERGY_USE_DATA_PER_GDP,
  ADD_HEALTH_DATA_PREVALENCE_UNDERWEIGHT, ADD_POPULATION_DATA_METRIC_TOTAL, ADD_POPULATION_DATA_METRIC_URBAN,
  ADD_POPULATION_DATA_METRIC_URBAN_GROWTH,
  ADD_POPULATION_DATA_PERCENTAGE_URBAN_AGGLOMERATIONS,
  ADD_POPULATION_DATA_PERCENTAGE_URBAN_POPULATION,
  ADD_POPULATION_DATA_PERCENTAGE_URBAN_POPULATION_GROWTH,
  ADD_RENEWABLE_ENERGY_DATA_RENEWABLE_ENERGY_CONSUMPTION,
  ADD_SOCIO_ECONOMIC_DATA_POVERTY_HEADCOUNT,
  ADD_WEATHER_DATA_TEMPERATURE,
  SOME_CASE_CLIMATE_DATA
} from "./store/actions/climate.actions";
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
        fromRenewableExcludingHydro: {}
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

  climateModelState$: Observable<ApplicationState>;
  private testClimateData$: Observable<IndicatorAttributesModel[]>;
  private climateStateSub: Subscription;
  lists<Any>;

  constructor(
    private apiService: ApiService,
    private store: Store<ApplicationState>
  ) {
    this.climateModelState$ = this.store.select(state => state);
    this.testClimateData$ = this.store.select(state => state.climateData.climateIndicatorData.data.education.primaryCompletionRate);
    this.climateStateSub = this.climateModelState$.subscribe(state => {
      console.log('state', state);
    })
  }


  ngOnInit() {
    this.store.dispatch({ type: SOME_CASE_CLIMATE_DATA, payload: [initialIndicatorAttributes]});
    this.populateFileData()
    console.log('data model', this.dataModel);
    this.tempTestFunction();
    this.climateStateSub = this.climateModelState$.subscribe(state => {
      console.log('state', state.climateData.climateIndicatorData.data);
      this.lists = state.climateData.climateIndicatorData.data;
    })
  }

  ngOnDestroy() {}

  tempTestFunction() {
    const newDataFromEndpoint = this.apiService.httpGet()
      .subscribe(data => {
        //console.log('data from api', data);
      });
  }
  populateFileData() {
    this.populateFromFile('education/primary-completion-rate.json', ADD_EDUCATION_DATA_PRIMARY_COMPLETION);
    this.populateFromFile('education/primary-secondary-enrollment.json', ADD_EDUCATION_DATA_SECONDARY);
    this.populateFromFile('energy-use/energy-use-per-capita.json', ADD_ENERGY_USE_DATA_PER_CAPITA);
    this.populateFromFile('energy-use/energy-use-per-gdp.json', ADD_ENERGY_USE_DATA_PER_GDP);
    this.populateFromFile('health/prevalence-underweight-age.json', ADD_HEALTH_DATA_PREVALENCE_UNDERWEIGHT );
    this.populateFromFile('renewable-energy/renewable-energy-consumption.json', ADD_RENEWABLE_ENERGY_DATA_RENEWABLE_ENERGY_CONSUMPTION);
    this.populateFromFile('socio-economic/poverty-headcount-ratio.json', ADD_SOCIO_ECONOMIC_DATA_POVERTY_HEADCOUNT);
    this.populateFromFile('weather/av-precip-depth.json', ADD_WEATHER_DATA_TEMPERATURE);
    this.populateFromFile(
      'electricity-production/percentage-based/electrical-production-from-coal-percentage.json',
      ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_COAL
    );
    this.populateFromFile(
      'electricity-production/percentage-based/electricity-production-from-hydroelectric-percentage.json',
      ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_HYDROELECTRIC
    );
    this.populateFromFile(
      'electricity-production/percentage-based/electricity-production-from-natural-gas-percentage.json',
      ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_NATURAL_GAS
    );
    this.populateFromFile(
      'electricity-production/percentage-based/electricity-production-from-nuclear-percentage.json',
      ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_NUCLEAR
    );
    this.populateFromFile(
      'electricity-production/percentage-based/electricity-production-from-oil-percentage.json',
      ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_OIL
    );
    this.populateFromFile(
      'electricity-production/percentage-based/electricity-production-from-renewable-percentage.json',
      ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_RENEWABLE
    );
    this.populateFromFile(
      'electricity-production/percentage-based/renewable-electricity-output-percentage.json',
      ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_RENEWABLE_OUTPUT
    );
    this.populateFromFile(
      'electricity-production/metric/electricity-production-from-renewable-excluding-hydro-percentage-kwh.json',
      ADD_ELECTRICITY_PRODUCTION_DATA_METRIC_FROM_RENEWABLE_EXCLUDING_HYDRO
    );

    this.populateFromFile(
      'emissions/metric/co2-emissions-kt.json',
      ADD_EMISSIONS_DATA_METRIC_CO2
    );
    this.populateFromFile(
      'emissions/metric/hfc-gas-emissions.json',
      ADD_EMISSIONS_DATA_METRIC_HFC
    );
    this.populateFromFile(
      'emissions/metric/methane-emissions-kt.json',
      ADD_EMISSIONS_DATA_METRIC_METHANE
    );
    this.populateFromFile(
      'emissions/metric/nitrous-oxide-emissions-c02-equiv.json',
      ADD_EMISSIONS_DATA_METRIC_NITROUS_OXIDE
    );
    this.populateFromFile(
      'emissions/metric/other-greenhouse-gas-emissions-metrics.json',
      ADD_EMISSIONS_DATA_METRIC_OTHER_GREENHOUSE
    );
    this.populateFromFile(
      'emissions/metric/pvc-gas-emissions-metric.json',
      ADD_EMISSIONS_DATA_METRIC_PVC
    );
    this.populateFromFile(
      'emissions/metric/sf6-gas-emissions.json',
      ADD_EMISSIONS_DATA_METRIC_SF6
    );
    this.populateFromFile(
      'emissions/metric/total-greenhouse-gas.json',
      ADD_EMISSIONS_DATA_METRIC_TOTAL
    );

    this.populateFromFile(
      'emissions/percentage-based/co2-emissions-from-gaseous-fuel-consumption.json',
      ADD_EMISSIONS_DATA_PERCENTAGE_CO2_GAS
    );
    this.populateFromFile(
      'emissions/percentage-based/co2-emissions-from-solid-fuel-consumption.json',
      ADD_EMISSIONS_DATA_PERCENTAGE_CO2_SOLID
    );
    this.populateFromFile(
      'emissions/percentage-based/methane-emissions-percent-change.json',
      ADD_EMISSIONS_DATA_PERCENTAGE_METHANE
    );
    this.populateFromFile(
      'emissions/percentage-based/nitrous-oxide-emissions-percent-change.json',
      ADD_EMISSIONS_DATA_PERCENTAGE_NITROUS_OXIDE
    );
    this.populateFromFile(
      'emissions/percentage-based/other-greenhouse-gas-percent-change.json',
      ADD_EMISSIONS_DATA_PERCENTAGE_OTHER_GREENHOUSE
    );
    this.populateFromFile(
      'emissions/percentage-based/total-greenhouse-gas-percent-of-total.json',
      ADD_EMISSIONS_DATA_PERCENTAGE_TOTAL_GREENHOUSE
    );

    this.populateFromFile(
      'population/metric/population-total.json',
      ADD_POPULATION_DATA_METRIC_TOTAL
    );
    this.populateFromFile(
      'population/metric/urban-population.json',
      ADD_POPULATION_DATA_METRIC_URBAN
    );
    this.populateFromFile(
      'population/metric/urban-population-growth.json',
      ADD_POPULATION_DATA_METRIC_URBAN_GROWTH
    );

    this.populateFromFile(
      'population/percentage-based/population-in-urban-agglomerations.json',
      ADD_POPULATION_DATA_PERCENTAGE_URBAN_AGGLOMERATIONS
    );
    this.populateFromFile(
      'population/percentage-based/urban-population-growth.json',
      ADD_POPULATION_DATA_PERCENTAGE_URBAN_POPULATION_GROWTH
    );
    this.populateFromFile(
      'population/percentage-based/urban-population-percent-of-total.json',
      ADD_POPULATION_DATA_PERCENTAGE_URBAN_POPULATION
    );


}

  populateFromFile(filePath, actionType) {
    const jsonUrl = 'assets/json/' + filePath;
    this.apiService.httpGetFile(jsonUrl)
      .subscribe(data => {
        if (data) {
          const derivedAverageSets = this.getDataAverages(data, data[0]['indicatorName'], data[0]['indicatorCode']);
          this.store.dispatch({ type: actionType, payload: derivedAverageSets});
        }
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
