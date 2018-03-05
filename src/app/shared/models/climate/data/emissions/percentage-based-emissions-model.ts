
import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
export interface PercentageBasedEmissionsDataModel {
  co2_gas: IndicatorAttributesModel[];
  co2_solid: IndicatorAttributesModel[];
  methaneChange: IndicatorAttributesModel[];
  nitrousOxideChange: IndicatorAttributesModel[];
  OtherGreenhouseGasChange: IndicatorAttributesModel[];
  TotalGreenhouseGasChange: IndicatorAttributesModel[];
}

export const initialPercentageBasedEmissionsDataModel = {
  co2_gas: [initialIndicatorAttributes],
  co2_solid: [initialIndicatorAttributes],
  methaneChange: [initialIndicatorAttributes],
  nitrousOxideChange: [initialIndicatorAttributes],
  OtherGreenhouseGasChange: [initialIndicatorAttributes],
  TotalGreenhouseGasChange: [initialIndicatorAttributes]
};
