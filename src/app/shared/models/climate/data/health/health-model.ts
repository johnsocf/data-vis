import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
export interface HealthDataModel {
  prevalenceUnderweightAge: IndicatorAttributesModel;
}

export const initialHealthDataModel = {
  prevalenceUnderweightAge: initialIndicatorAttributes
};
