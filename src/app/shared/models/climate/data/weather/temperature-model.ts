import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
import {
  IndicatorAttributesTemperatureModel,
  initialIndicatorAttributesTemperature
} from "../items/indicator-attributes-temperature";
export interface WeatherDataModel {
  averagePrecipitationDepth: IndicatorAttributesModel;
  averageTemperature: IndicatorAttributesTemperatureModel;
}

export const initialWeatherDataModel = {
  averagePrecipitationDepth: initialIndicatorAttributes,
  averageTemperature: initialIndicatorAttributesTemperature
};
