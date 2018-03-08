import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
import {initialTempSetModel, TempSetModel} from "./temperature-set-model";
export interface WeatherDataModel {
  averagePrecipitationDepth: IndicatorAttributesModel;
  averageTemperature: TempSetModel[];
}

export const initialWeatherDataModel = {
  averagePrecipitationDepth: initialIndicatorAttributes,
  averageTemperature: [initialTempSetModel]
};
