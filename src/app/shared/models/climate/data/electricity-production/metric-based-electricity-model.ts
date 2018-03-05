
import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
export interface MetricBasedElectricityProductionDataModel {
  fromRenewableExcludingHyrdo: IndicatorAttributesModel[];
}

export const initialMetricBasedElectricityProductionDataModel = {
  fromRenewableExcludingHyrdo: [initialIndicatorAttributes]
};
