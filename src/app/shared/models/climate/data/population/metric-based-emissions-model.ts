
import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
export interface MetricBasedPopulationDataModel {
  totalPopulation: IndicatorAttributesModel[];
  urbanPopulation: IndicatorAttributesModel[];
  urbanPopulationGrowth: IndicatorAttributesModel[];
}

export const initialMetricBasedPopulationDataModel = {
  totalPopulation: [initialIndicatorAttributes],
  urbanPopulation: [initialIndicatorAttributes],
  urbanPopulationGrowth: [initialIndicatorAttributes]
};
