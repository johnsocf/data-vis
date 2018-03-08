import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
import {
  IndicatorAttributesTemperatureModel,
  initialIndicatorAttributesTemperature
} from "../items/indicator-attributes-temperature";
export interface TempSetModel {
  country: string;
  tempOverYears: IndicatorAttributesTemperatureModel[];
}

export const initialTempSetModel = {
  country: 'USA',
  tempOverYears: [initialIndicatorAttributesTemperature]
};
