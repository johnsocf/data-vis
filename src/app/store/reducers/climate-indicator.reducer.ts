

import * as _ from 'lodash';
import {ClimateModel, initialClimateState} from "../../shared/models/climate.model";
import {CustomAction} from "../actions/custom.action";
import {
  ADD_EDUCATION_DATA_PRIMARY_COMPLETION, ADD_EDUCATION_DATA_SECONDARY,
  ADD_ELECTRICITY_PRODUCTION_DATA_METRIC_FROM_RENEWABLE_EXCLUDING_HYDRO,
  ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_COAL,
  ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_HYDROELECTRIC, ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_NATURAL_GAS,
  ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_NUCLEAR, ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_OIL,
  ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_RENEWABLE, ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_RENEWABLE_OUTPUT,
  ADD_EMISSIONS_DATA_METRIC_CO2, ADD_EMISSIONS_DATA_METRIC_HFC, ADD_EMISSIONS_DATA_METRIC_METHANE,
  ADD_EMISSIONS_DATA_METRIC_NITROUS_OXIDE, ADD_EMISSIONS_DATA_METRIC_OTHER_GREENHOUSE, ADD_EMISSIONS_DATA_METRIC_PVC,
  ADD_EMISSIONS_DATA_METRIC_SF6, ADD_EMISSIONS_DATA_METRIC_TOTAL,
  ADD_EMISSIONS_DATA_PERCENTAGE_CO2_GAS, ADD_EMISSIONS_DATA_PERCENTAGE_CO2_SOLID, ADD_EMISSIONS_DATA_PERCENTAGE_METHANE,
  ADD_EMISSIONS_DATA_PERCENTAGE_NITROUS_OXIDE, ADD_EMISSIONS_DATA_PERCENTAGE_OTHER_GREENHOUSE,
  ADD_EMISSIONS_DATA_PERCENTAGE_TOTAL_GREENHOUSE, ADD_ENERGY_USE_DATA_PER_CAPITA, ADD_ENERGY_USE_DATA_PER_GDP,
  ADD_HEALTH_DATA_PREVALENCE_UNDERWEIGHT, ADD_POPULATION_DATA_METRIC_TOTAL, ADD_POPULATION_DATA_METRIC_URBAN,
  ADD_POPULATION_DATA_METRIC_URBAN_GROWTH,
  ADD_POPULATION_DATA_PERCENTAGE_URBAN_AGGLOMERATIONS,
  ADD_POPULATION_DATA_PERCENTAGE_URBAN_POPULATION, ADD_POPULATION_DATA_PERCENTAGE_URBAN_POPULATION_GROWTH,
  ADD_RENEWABLE_ENERGY_DATA_RENEWABLE_ENERGY_CONSUMPTION, ADD_SOCIO_ECONOMIC_DATA_POVERTY_HEADCOUNT,
  ADD_WEATHER_DATA_PRECIPITATION,
  ADD_WEATHER_DATA_TEMPERATURE,
  SOME_CASE_CLIMATE_DATA
} from "../actions/climate.actions";

export function ClimateIndicatorReducer(state = initialClimateState, action: CustomAction): ClimateModel {
  switch (action.type) {
    case SOME_CASE_CLIMATE_DATA: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.education.primaryCompletionRate = action.payload;
      return newState;
    }

    case ADD_EDUCATION_DATA_PRIMARY_COMPLETION: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.education.primaryCompletionRate = action.payload;
      return newState;
    }
    case ADD_EDUCATION_DATA_SECONDARY: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.education.primarySecondaryEnrollment = action.payload;
      return newState;
    }
    case ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_COAL: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.electricityProduction.percentage.coal = action.payload;
      return newState;
    }
    case ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_HYDROELECTRIC: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.electricityProduction.percentage.hydroElectric = action.payload;
      return newState;
    }
    case ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_NATURAL_GAS: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.electricityProduction.percentage.naturalGas = action.payload;
      return newState;
    }
    case ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_NUCLEAR: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.electricityProduction.percentage.nuclear = action.payload;
      return newState;
    }
    case ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_OIL: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.electricityProduction.percentage.oil = action.payload;
      return newState;
    }
    case ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_RENEWABLE: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.electricityProduction.percentage.renewable = action.payload;
      return newState;
    }
    case ADD_ELECTRICITY_PRODUCTION_DATA_PERCENTAGE_RENEWABLE_OUTPUT: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.electricityProduction.percentage.renewableOutput = action.payload;
      return newState;
    }
    case ADD_ELECTRICITY_PRODUCTION_DATA_METRIC_FROM_RENEWABLE_EXCLUDING_HYDRO: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.electricityProduction.metric.fromRenewableExcludingHydro = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_PERCENTAGE_CO2_GAS: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.percentage.co2_gas = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_PERCENTAGE_CO2_SOLID: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.percentage.co2_solid = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_PERCENTAGE_NITROUS_OXIDE: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.percentage.nitrousOxideChange = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_PERCENTAGE_OTHER_GREENHOUSE: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.percentage.otherGreenhouseGasChange = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_PERCENTAGE_TOTAL_GREENHOUSE: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.percentage.totalGreenhouseGasChange = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_PERCENTAGE_METHANE: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.percentage.methaneChange = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_METRIC_CO2: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.metric.co2 = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_METRIC_METHANE: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.metric.methane = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_METRIC_HFC: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.metric.hfc = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_METRIC_NITROUS_OXIDE: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.metric.nitrousOxide = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_METRIC_OTHER_GREENHOUSE: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.metric.otherGreenhouse = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_METRIC_PVC: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.metric.pvc = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_METRIC_SF6: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.metric.sf6 = action.payload;
      return newState;
    }
    case ADD_EMISSIONS_DATA_METRIC_TOTAL: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.emissions.metric.total = action.payload;
      return newState;
    }
    case ADD_ENERGY_USE_DATA_PER_CAPITA : {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.energyUse.perCapita = action.payload;
      return newState;
    }
    case ADD_ENERGY_USE_DATA_PER_GDP: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.energyUse.perGDP = action.payload;
      return newState;
    }
    case ADD_HEALTH_DATA_PREVALENCE_UNDERWEIGHT:  {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.health.prevalenceUnderweightAge = action.payload;
      return newState;
    }
    case ADD_POPULATION_DATA_PERCENTAGE_URBAN_AGGLOMERATIONS: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.population.percentage.populationInUrbanAgglomerations = action.payload;
      return newState;
    }
    case ADD_POPULATION_DATA_PERCENTAGE_URBAN_POPULATION: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.population.percentage.urbanPopulation = action.payload;
      return newState;
    }
    case ADD_POPULATION_DATA_PERCENTAGE_URBAN_POPULATION_GROWTH: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.population.percentage.urbanPopulationGrowth = action.payload;
      return newState;
    }
    case ADD_POPULATION_DATA_METRIC_TOTAL: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.population.metric.totalPopulation = action.payload;
      return newState;
    }
    case ADD_POPULATION_DATA_METRIC_URBAN: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.population.metric.urbanPopulation = action.payload;
      return newState;
    }
    case ADD_POPULATION_DATA_METRIC_URBAN_GROWTH: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.population.metric.urbanPopulationGrowth = action.payload;
      return newState;
    }
    case ADD_RENEWABLE_ENERGY_DATA_RENEWABLE_ENERGY_CONSUMPTION: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.renewableEnergy.renewableEnergyConsumption = action.payload;
      return newState;
    }
    case ADD_SOCIO_ECONOMIC_DATA_POVERTY_HEADCOUNT: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.socioEconomic.povertyHeadcountRatio = action.payload;
      return newState;
    }
    case ADD_WEATHER_DATA_PRECIPITATION: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.weather.averagePrecipitationDepth = action.payload;
      return newState;
    }
    case ADD_WEATHER_DATA_TEMPERATURE: {
      const newState = _.cloneDeep(state);
      newState.climateIndicatorData.data.weather.averageTemperature = action.payload;
      return newState;
    }


    default:
      return state;

  }
}
