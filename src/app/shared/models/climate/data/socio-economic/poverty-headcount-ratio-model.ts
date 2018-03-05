import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
export interface SocioEconomicDataModel {
  povertyHeadcountRatio: IndicatorAttributesModel;
}

export const initialSocioEconomicDataModel = {
  povertyHeadcountRatio: initialIndicatorAttributes
};
