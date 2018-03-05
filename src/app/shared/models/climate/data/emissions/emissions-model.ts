import {initialMetricBasedEmissionsDataModel, MetricBasedEmissionsDataModel} from "./metric-based-emissions-model";
import {
  initialPercentageBasedEmissionsDataModel,
  PercentageBasedEmissionsDataModel
} from "./percentage-based-emissions-model";
export interface EmissionsDataModel {
  metric: MetricBasedEmissionsDataModel;
  percentage: PercentageBasedEmissionsDataModel;
}

export const initialEmissionsDataModel = {
  metric: initialMetricBasedEmissionsDataModel,
  percentage: initialPercentageBasedEmissionsDataModel
};
