
import {
  initialMetricBasedElectricityProductionDataModel,
  MetricBasedElectricityProductionDataModel
} from "./metric-based-electricity-model";
import {
  initialPercentageBasedElectricityProductionDataModel,
  PercentageBasedElectricityProductionDataModel
} from "./percentage-based-electricity-production-model";
export interface ElectricityProductionDataModel {
  metric: MetricBasedElectricityProductionDataModel;
  percentage: PercentageBasedElectricityProductionDataModel;
}

export const initialElectricityProductionDataModel = {
  metric: initialMetricBasedElectricityProductionDataModel,
  percentage: initialPercentageBasedElectricityProductionDataModel
};
