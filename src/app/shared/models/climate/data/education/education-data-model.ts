
import {IndicatorAttributesModel, initialIndicatorAttributes} from "../items/indicator-attributes-model";
export interface EducationDataModel {
  primaryCompletionRate: IndicatorAttributesModel[];
  primarySecondaryEnrollment: IndicatorAttributesModel[];
}

export const initialEducationDataModel = {
  primaryCompletionRate: [initialIndicatorAttributes],
  primarySecondaryEnrollment: [initialIndicatorAttributes]
};
