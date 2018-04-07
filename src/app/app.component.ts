import {Component, OnDestroy, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {ApiService} from "./shared/api.service";
import {Store} from "@ngrx/store";
import {ApplicationState} from "./store/application-state";
import {
  ADD_ALL_DATA,
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
  ADD_SOCIO_ECONOMIC_DATA_POVERTY_HEADCOUNT, ADD_WEATHER_DATA_PRECIPITATION,
  ADD_WEATHER_DATA_TEMPERATURE,
  SOME_CASE_CLIMATE_DATA
} from "./store/actions/climate.actions";
import {Observable} from "rxjs/Observable";
import {
  IndicatorAttributesModel,
  initialIndicatorAttributes
} from "./shared/models/climate/data/items/indicator-attributes-model";
import {ShareService} from "./services/shared.service";
import {DATA_TRANSFORMS_COMPLETE} from "./store/actions/ui.actions";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Climate Change Indicators: Vis';
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
  //private climateStateSub: Subscription;
  private climateStateSub: any;
  lists: any = {};
  attrSelection: any;
  selectionSet: any;
  selectionSetTitle: any = 'Select Climate Change Indicator';
  countrySelections: any  [];
  colorMap: any;
  private _shares: any;
  loadFlag: false;

  constructor(
    private apiService: ApiService,
    private store: Store<ApplicationState>,
    private shareservice: ShareService
  ) {
    this.climateModelState$ = this.store.select(state => state);
    this.testClimateData$ = this.store.select(state => state.climateData.climateIndicatorData.data.education.primaryCompletionRate);
    this.climateStateSub = this.climateModelState$.subscribe(state => {
      //console.log('state', state);
    })
  }


  ngOnInit() {
    //this.store.dispatch({ type: SOME_CASE_CLIMATE_DATA, payload: [initialIndicatorAttributes]});
    this.populateFileData();
    this.populateTemperatureFromFile('weather/av-temperature.json');
    this.tempTestFunction();
    // this.getShares('/shares').subscribe(d => {
    //   console.log('d', d);
    //   this._shares = d[0];
    //   this.store.dispatch({type: ADD_ALL_DATA, payload: d[0]});
    // });
    this.shareservice.deleteShares();
    this.climateStateSub = this.climateModelState$.subscribe(state => {
      this.colorMap = state.uiModel.colorSet;
      this.attrSelection = state.uiModel.selectedAttribute;
      this.countrySelections = state.uiModel.selectedCountries;
      this.lists = state.climateData.climateIndicatorData.data;
      console.log('climate list', this.lists);

        setTimeout(d => {
          if (!this.loadFlag) {
          console.log('share')
          this.shareservice.addShare(this.lists);
          this.loadFlag = true;
          }

        }, 140000);


    });
    // this.populateFromFile(
    //   'electricity-production/metric/electricity-production-from-renewable-excluding-hydro-percentage-kwh.json',
    //   ADD_ELECTRICITY_PRODUCTION_DATA_METRIC_FROM_RENEWABLE_EXCLUDING_HYDRO
    // );


  }

  getShares(path) {
    return this.shareservice.getShares(path);
  }

  ngOnDestroy() {}

  unCamel(string) {
    return string.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1")
  }

  selectModel(selectedValue) {
    let valueArray = selectedValue.trim().split(',');

    let one = valueArray[1];
    let two;
    let three;


    switch(valueArray[0]) {
      case 'one':
        this.attrSelection = this.lists[one];
        this.selectionSetTitle = this.unCamel(one).toUpperCase();
        break;
      case 'two':
        two = valueArray[2];
        this.attrSelection = this.lists[one][two];
        this.selectionSetTitle = this.unCamel(one).toUpperCase() + ' : ' + this.unCamel(two).toUpperCase();
        break;
      case 'three':
        two = valueArray[2];
        three = valueArray[3];
        this.attrSelection = this.lists[one][two][three];
        this.selectionSetTitle = this.unCamel(one).toUpperCase() + ' : ' + this.unCamel(two).toUpperCase() + ' : ' + this.unCamel(three).toUpperCase();
        break;
      default:
        this.attrSelection = this.lists[one];
        this.selectionSetTitle = this.unCamel(one).toUpperCase();
    }

    let generalAverages = _.find(this.attrSelection.averages, {countryName: "general averages"})
    let countrySelection = _.find(this.attrSelection.countryData, {countryCode: "BWA"})

    this.selectionSet = this.attrSelection;

    // this.selectionSet = {
    //   generalAverages: generalAverages,
    //   countrySelection: countrySelection
    // }
  }

  formatOverallSelection() {

  }

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
    this.populateFromFile('weather/av-precip-depth.json', ADD_WEATHER_DATA_PRECIPITATION);
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
          const maxRow = {};
          const minRow = {};
          const countObjForAvg = {};
          let countIndexes = 0;
          const controller = this;
          console.log('derived average sets', derivedAverageSets)
          _.forEach(derivedAverageSets.countryData, function(countryObj) {
            _.forEach(countryObj.data, function(value, key) {
              if (!isNaN(parseInt(value.year))) {
                let newValue = parseInt(value.value);
                let maxValue;
                let minValue;

                // if data entry has a value
                if (!isNaN(newValue) && (newValue !== 0)) {
                  // set index to 1 on counter or get value of count if one exists
                  countIndexes = !isNaN(parseInt(countObjForAvg[value.year])) ? parseInt(countObjForAvg[value.year]) : 0;
                  if (countIndexes === 0) {
                    maxValue = 0;
                    minValue = 0;
                  } else {
                    maxValue = !isNaN(parseInt(maxRow[value.year])) ? parseInt(maxRow[value.year]) : 0;
                    minValue = !isNaN(parseInt(minRow[value.year])) ? parseInt(minRow[value.year]) : 0;
                  }

                  let setMinValue;
                  if (minValue === 0) {
                    setMinValue = newValue;
                  } else {
                    setMinValue = minValue < newValue ? minValue : newValue;
                  }

                  const setValue = maxValue > newValue ? maxValue : newValue;
                  const countIndex = countIndexes + 1;
                  _.assign(maxRow, {[value.year]: controller.precisionRound(setValue, 2)});
                  _.assign(minRow, {[value.year]: controller.precisionRound(setMinValue, 2)});
                  _.assign(countObjForAvg, {[value.year]: controller.precisionRound(countIndex, 2)});
                }
              }
            });
          });
          derivedAverageSets['maxRow'] = maxRow;
          derivedAverageSets['minRow'] = minRow;
          let newSets = _.forEach(derivedAverageSets.countryData, function(countryObj) {
            return _.map(countryObj.data, function(value) {
              const calculated = Math.ceil((value['value'] - minRow[value['year']]) / (maxRow[value['year']] - minRow[value['year']]) * 10);
              const numIsFinite = isFinite(calculated) && !isNaN(calculated) ? calculated : 0;
              console.log('calculated', numIsFinite);
              value['rank'] = numIsFinite;
            });
          });
          derivedAverageSets.countryData = newSets;
          this.store.dispatch({ type: actionType, payload: derivedAverageSets});
          //if (last) {this.store.dispatch({ type: DATA_TRANSFORMS_COMPLETE, payload: true});}
        }
      });
  }

  populateTemperatureFromFile(filePath) {
    const jsonUrl = 'assets/json/' + filePath;
    this.apiService.httpGetFile(jsonUrl)
      .subscribe(data => {
        if (data) {
          const tempSets = this.buildTempDataSet(data);
          const derivedAverageSets = this.getDataAverages(tempSets, 'Av Temperature', 'temp');
          this.store.dispatch({ type: ADD_WEATHER_DATA_TEMPERATURE, payload: tempSets});
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
    let averageSet;
      let highIncomeAverages;
      let upperMiddleIncomeAverages;
      let lowerMiddleIncomeAverages;
      let lowIncomeAverages;
      let averageSetConglomerated = [];
    if (indicatorCode.toLowerCase() === 'temp')  {
      averageSet = this.buildTempDataAverages(data, 'general');
      highIncomeAverages = this.getHighIncomeSetTemp(data);
      upperMiddleIncomeAverages = this.getUpperMiddleIncomeSetTemp(data);
      lowerMiddleIncomeAverages = this.getLowerMiddleIncomeSetTemp(data);
      lowIncomeAverages = this.getLowIncomeSetTemp(data);
      averageSetConglomerated = [averageSet, highIncomeAverages, upperMiddleIncomeAverages, lowerMiddleIncomeAverages, lowIncomeAverages];
      return {
        countryData: data,
        averages: averageSetConglomerated
      };
    } else {
      averageSet = this.buildDataAverages(data, 'general', indicatorName, indicatorCode);
      highIncomeAverages = this.getHighIncomeSet(data);
      upperMiddleIncomeAverages = this.getUpperMiddleIncomeSet(data);
      lowerMiddleIncomeAverages = this.getLowerMiddleIncomeSet(data);
      lowIncomeAverages = this.getLowIncomeSet(data);
      averageSetConglomerated = [averageSet, highIncomeAverages, upperMiddleIncomeAverages, lowerMiddleIncomeAverages, lowIncomeAverages];
      return {
        countryData: this.resetCountryData(data),
        averages: averageSetConglomerated
      };
    }

  }


  resetCountryData(data) {
    //let maxValue = _.maxBy(data, })

    let totalSet = _.map(data, (key, value) => {
      let thisCountry = key;

      let filteredSet = [];
      _.forEach(thisCountry, (value, key) => {
        let thisValue = value;
        if (typeof thisValue === 'number') {
          filteredSet.push({year: key, value: value});
        }
      });

      const thisTotalSet = _.assign({}, {
        countryName: thisCountry['countryName'],
        countryCode: thisCountry['countryCode'],
        indicatorName: thisCountry['indicatorName'],
        indicatorCode: thisCountry['indicatorCode'],
        data: filteredSet
      });

      return thisTotalSet;
    });


    return totalSet;


  }

  shortenedSet(totalAverages) {
    return {
      indicatorName: totalAverages.indicatorName,
      indicatorCode: totalAverages.indicatorCode,
      countryName: totalAverages.countryName,
      countryCode: totalAverages.countryCode,
      data: totalAverages.data
    };
  }

  getHighIncomeSet(data) {
    const thisController = this;
    const highIncomeSet = _.filter(data, function(o){ return thisController.highIncomeCountries.includes(o['countryCode'])});
    const totalAverages = this.buildDataAverages(highIncomeSet, 'high income', data[0].indicatorName, data[0].indicatorCode);
    return this.shortenedSet(totalAverages);
  }

  getUpperMiddleIncomeSet(data) {
    const thisController = this;
    const upperMiddleIncomeSet = _.filter(data, function(o){ return thisController.upperMiddleIncomeCountries.includes(o['countryCode'])});
    const totalAverages = this.buildDataAverages(upperMiddleIncomeSet, 'upper middle income', data[0].indicatorName, data[0].indicatorCode);
    return this.shortenedSet(totalAverages);
  }

  getLowerMiddleIncomeSet(data) {
    const thisController = this;
    const lowerMiddleIncomeSet = _.filter(data, function(o){ return thisController.lowerMiddleIncomeCountries.includes(o['countryCode'])});
    //console.log('lower middle income set', lowerMiddleIncomeSet);
    const totalAverages = this.buildDataAverages(lowerMiddleIncomeSet, 'lower middle income', data[0].indicatorName, data[0].indicatorCode);
    return this.shortenedSet(totalAverages);
  }

  getLowIncomeSet(data) {
    const thisController = this;
    const lowIncomeSet = _.filter(data, function(o){ return thisController.lowIncomeCountries.includes(o['countryCode'])});
    const totalAverages =  this.buildDataAverages(lowIncomeSet, 'low income', data[0].indicatorName, data[0].indicatorCode);
    return this.shortenedSet(totalAverages);
  }

  getHighIncomeSetTemp(data) {
    const thisController = this;
    const highIncomeSet = _.filter(data, function(o){ return thisController.highIncomeCountries.includes(o['Country'])});
    return this.buildTempDataAverages(highIncomeSet, 'high income');
  }

  getUpperMiddleIncomeSetTemp(data) {
    const thisController = this;
    const upperMiddleIncomeSet = _.filter(data, function(o){ return thisController.upperMiddleIncomeCountries.includes(o['Country'])});
    return this.buildTempDataAverages(upperMiddleIncomeSet, 'upper middle income');
  }

  getLowerMiddleIncomeSetTemp(data) {
    const thisController = this;
    const lowerMiddleIncomeSet = _.filter(data, function(o){ return thisController.lowerMiddleIncomeCountries.includes(o['Country'])});
    //console.log('lower middle income set', lowerMiddleIncomeSet);
    return this.buildTempDataAverages(lowerMiddleIncomeSet, 'lower middle income');
  }

  getLowIncomeSetTemp(data) {
    const thisController = this;
    const lowIncomeSet = _.filter(data, function(o){ return thisController.lowIncomeCountries.includes(o['Country'])});
    return this.buildTempDataAverages(lowIncomeSet, 'low income');
  }

  mapMonth(number) {
    const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'Oct', 'Nov', 'Dec'];
    return months[number - 1];
  }

  buildTempDataSet(initialJson) {
    const allCountrySet = {};
    let allCountryArray = []
    const thisController = this;
    _.forEach(initialJson, function(tempSet){
      const foundInCountrySet = _.find(allCountrySet, {'Country': tempSet.Country})
      if (!foundInCountrySet) {
        // push to country set
        let countryDates = _.filter(initialJson, {'Country': tempSet.Country})
        let countrySet = {};
        let yearHolder = {};
        let monthHolder = {};
        let year = 0;
        countrySet['Country'] = countryDates[0].Country;
        _.forEach(countryDates, function(tempMetric) {
          if (year !== tempMetric.Year) {
            monthHolder = {};
            yearHolder = {};
            year = tempMetric.Year;
          }
          let month = thisController.mapMonth(tempMetric.Month);
          let currentYear = tempMetric.Year;
          let tasMetric = tempMetric.tas;
          let monthAttr = _.assign({}, {[month]: tasMetric});
          let months = _.assign(monthHolder, monthAttr);
          let years = _.assign(yearHolder, {[currentYear]: monthHolder});
          let subset = _.assign(countrySet, yearHolder);
        });

       _.assign(allCountrySet, {countrySet});
       allCountryArray.push(countrySet);
      }

    });

    return allCountryArray;
  }

  buildTempDataAverages(set, setName) {
    const totalRow = {};
    const countObjForAvg = {};
    const averageSet = {};
    let countMonthIndexes = {};
    let monthAverageSet = {};
    let lastCountry;
    const controller = this;
    _.forEach(set, function(countryObj) {
      // per country set
      let countYearIndexes = 0;
        if (lastCountry !== countryObj.Country) {
          lastCountry = countryObj.Country;
        }
      _.forEach(countryObj, function(value, key) {
        countYearIndexes ++;
        if (!totalRow[key]) {
          _.assign(totalRow, {[key]: {}});
          _.assign(countObjForAvg, {[key]: {}});
          _.assign(averageSet, {[key]: {}});
          countMonthIndexes[key] = {};
        }

        // per year
        _.forEach(value, function(valueTemp, keyMonth) {
          // for months
          let newValue = controller.precisionRound(valueTemp, 2);
          let valueSum;
          countMonthIndexes[key][keyMonth] = !isNaN(controller.precisionRound(countObjForAvg[key][keyMonth], 2)) ? controller.precisionRound(countObjForAvg[key][keyMonth], 2) : 0;
          let isNanNum = !isNaN(controller.precisionRound(totalRow[key][keyMonth], 2));
          let isNanNum2 = isNaN(controller.precisionRound(totalRow[key][keyMonth], 2));
          let isNanNum3 = controller.precisionRound(totalRow[key][keyMonth], 2);
          if (!countMonthIndexes[key][keyMonth]) {
            valueSum = 0;
          } else {
            valueSum = (controller.precisionRound(totalRow[key][keyMonth], 2)) ? controller.precisionRound(totalRow[key][keyMonth], 2) : 0;
          }
          countMonthIndexes[key][keyMonth] ++ ;
          const total = (newValue + valueSum);
          _.assign(totalRow[key], {[keyMonth]: controller.precisionRound(total, 2)});
          _.assign(countObjForAvg[key], {[keyMonth]: controller.precisionRound(countMonthIndexes[key][keyMonth], 2)});
          const avgNow =  totalRow[key][keyMonth] / countObjForAvg[key][keyMonth];
          _.assign(averageSet[key], {[keyMonth]: controller.precisionRound(avgNow, 2)});
        })
      });
    });
    _.assign(averageSet, {
      countryName: setName + ' averages',
      countryCode: 'temp',
    });
    return averageSet;
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

   return _.assign({}, {
      countryName: setName + ' averages',
      countryCode: "AVG",
      indicatorName: indicatorName,
      indicatorCode: indicatorCode,
      data: this.setFormat(averageSet)
    });
    //return averageSet;
  }

  setFormat(averageSet) {
    let newSet = _.map(averageSet, (value, key) => {
      return {year: key, value: value};
    });
    return newSet;
  }

  precisionRound(number, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

}
