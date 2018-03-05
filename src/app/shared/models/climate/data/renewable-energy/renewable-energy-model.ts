import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
export interface RenewableEnergyDataModel {
  renewableEnergyConsumption: IndicatorAttributesModel;
}

export const initialRenewableEnergyDataModel = {
  renewableEnergyConsumption: initialIndicatorAttributes
};
