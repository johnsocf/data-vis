import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
export interface WeatherDataModel {
  averagePrecipitationDepth: IndicatorAttributesModel;
}

export const initialWeatherDataModel = {
  averagePrecipitationDepth: initialIndicatorAttributes
};
