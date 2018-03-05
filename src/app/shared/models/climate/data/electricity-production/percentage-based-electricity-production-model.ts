
import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
export interface PercentageBasedElectricityProductionDataModel {
  coal: IndicatorAttributesModel[];
  hydroElectric: IndicatorAttributesModel[];
  naturalGas: IndicatorAttributesModel[];
  nuclear: IndicatorAttributesModel[];
  oil: IndicatorAttributesModel[];
  renewable: IndicatorAttributesModel[];
  renewableOutput: IndicatorAttributesModel[];
}

export const initialPercentageBasedElectricityProductionDataModel = {
  coal: [initialIndicatorAttributes],
  hydroElectric: [initialIndicatorAttributes],
  naturalGas: [initialIndicatorAttributes],
  nuclear: [initialIndicatorAttributes],
  oil: [initialIndicatorAttributes],
  renewable: [initialIndicatorAttributes],
  renewableOutput: [initialIndicatorAttributes]
};

