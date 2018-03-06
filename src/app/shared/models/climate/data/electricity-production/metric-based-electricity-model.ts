
import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
export interface MetricBasedElectricityProductionDataModel {
  fromRenewableExcludingHydro: IndicatorAttributesModel[];
}

export const initialMetricBasedElectricityProductionDataModel = {
  fromRenewableExcludingHydro: [initialIndicatorAttributes]
};
