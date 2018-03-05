

import * as _ from 'lodash';
import {ClimateModel, initialClimateState} from "../../shared/models/climate.model";
import {CustomAction} from "../actions/custom.action";
import {SOME_CASE_CLIMATE_DATA} from "../actions/climate.actions";

export function ClimateIndicatorReducer(state = initialClimateState, action: CustomAction): ClimateModel {
  console.log('action type', action.type);
  switch (action.type) {
    case SOME_CASE_CLIMATE_DATA: {
      const newState = _.cloneDeep(state);
      console.log('here', newState);
      newState.climateIndicatorData.data.education.primaryCompletionRate = action.payload;
      console.log('here', newState);
      return newState;
    }
    default:
      return state;

  }
}
