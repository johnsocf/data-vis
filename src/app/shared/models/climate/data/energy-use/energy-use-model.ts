import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
export interface EnergyUseDataModel {
  perCapita: IndicatorAttributesModel;
  perGDP: IndicatorAttributesModel;
}

export const initialEnergyUseDataModel = {
  perCapita: initialIndicatorAttributes,
  perGDP: initialIndicatorAttributes
};
