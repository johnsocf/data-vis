import {EducationDataModel, initialEducationDataModel} from "./education/education-data-model";
import {
  ElectricityProductionDataModel,
  initialElectricityProductionDataModel
} from "./electricity-production/electricity-production-model";
import {EmissionsDataModel, initialEmissionsDataModel} from "./emissions/emissions-model";
import {EnergyUseDataModel, initialEnergyUseDataModel} from "./energy-use/energy-use-model";
import {HealthDataModel, initialHealthDataModel} from "./health/health-model";
import {initialPopulationDataModel, PopulationDataModel} from "./population/population-model";
import {initialRenewableEnergyDataModel, RenewableEnergyDataModel} from "./renewable-energy/renewable-energy-model";
import {initialSocioEconomicDataModel, SocioEconomicDataModel} from "./socio-economic/poverty-headcount-ratio-model";
import {initialWeatherDataModel, WeatherDataModel} from "./weather/temperature-model";
export interface IClimateIndicatorDataState {
  education: EducationDataModel;
  //electricityProduction: ElectricityProductionDataModel;
  emissions: EmissionsDataModel;
  energyUse: EnergyUseDataModel;
  health: HealthDataModel;
  population: PopulationDataModel;
  renewableEnergy: RenewableEnergyDataModel;
  socioEconomic: SocioEconomicDataModel;
  weather: WeatherDataModel;
}
export const initialClimateIndicatorDataState: IClimateIndicatorDataState = {
  education: initialEducationDataModel,
  //electricityProduction: initialElectricityProductionDataModel,
  emissions: initialEmissionsDataModel,
  energyUse: initialEnergyUseDataModel,
  health: initialHealthDataModel,
  population: initialPopulationDataModel,
  renewableEnergy: initialRenewableEnergyDataModel,
  socioEconomic: initialSocioEconomicDataModel,
  weather: initialWeatherDataModel
};

// export class ClimateIndicatorDataState implements IClimateIndicatorDataState {
//   constructor (
//     public dataData: string,
//   ) {}
// }
