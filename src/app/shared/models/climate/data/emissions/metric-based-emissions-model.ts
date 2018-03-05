
import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
export interface MetricBasedEmissionsDataModel {
  co2: IndicatorAttributesModel[];
  methane: IndicatorAttributesModel[];
  hfc: IndicatorAttributesModel[];
  nitrousOxide: IndicatorAttributesModel[];
  otherGreenhouse: IndicatorAttributesModel[];
  pvc: IndicatorAttributesModel[];
  sf6: IndicatorAttributesModel[];
  total: IndicatorAttributesModel[];
}

export const initialMetricBasedEmissionsDataModel = {
  co2: [initialIndicatorAttributes],
  methane: [initialIndicatorAttributes],
  hfc: [initialIndicatorAttributes],
  nitrousOxide: [initialIndicatorAttributes],
  otherGreenhouse: [initialIndicatorAttributes],
  pvc: [initialIndicatorAttributes],
  sf6: [initialIndicatorAttributes],
  total: [initialIndicatorAttributes]
};
