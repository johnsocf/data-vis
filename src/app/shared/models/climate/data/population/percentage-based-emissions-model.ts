
import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
export interface PercentageBasedPopulationDataModel {
  populationInUrbanAgglomerations: IndicatorAttributesModel[];
  urbanPopulation : IndicatorAttributesModel[];
  urbanPopulationGrowth: IndicatorAttributesModel[];
}
export const initialPercentageBasedPopulationDataModel = {
  populationInUrbanAgglomerations: [initialIndicatorAttributes],
  urbanPopulation: [initialIndicatorAttributes],
  urbanPopulationGrowth: [initialIndicatorAttributes]
};
