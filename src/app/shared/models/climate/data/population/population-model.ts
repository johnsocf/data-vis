import {initialMetricBasedPopulationDataModel, MetricBasedPopulationDataModel} from "./metric-based-emissions-model";
import {
  initialPercentageBasedPopulationDataModel,
  PercentageBasedPopulationDataModel
} from "./percentage-based-emissions-model";
export interface PopulationDataModel {
  metric: MetricBasedPopulationDataModel,
  percentage: PercentageBasedPopulationDataModel
}

export const initialPopulationDataModel = {
  metric: initialMetricBasedPopulationDataModel,
  percentage: initialPercentageBasedPopulationDataModel
};
