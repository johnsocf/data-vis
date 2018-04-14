

import {CustomAction} from "../actions/custom.action";
import {initialUiState, uIModel} from "../../shared/models/ui.model";
import {
  DATA_TRANSFORMS_COMPLETE, UPDATE_ATTRIBUTE_SET_FOR_COUNTRY, UPDATE_ATTRIBUTES_SELECTION, UPDATE_COLOR_MAP,
  UPDATE_COUNTRIES_SELECTION
} from "../actions/ui.actions";
import * as _ from 'lodash';
import {countryMap} from '../../../assets/maps/country-maps';

export function UIStateReducer(state = initialUiState, action: CustomAction): uIModel {
  switch (action.type) {
    case UPDATE_COUNTRIES_SELECTION: {
      const newState = _.cloneDeep(state);
      const alpha3_conversion_object = _.find(countryMap, {'alpha-2': action.payload});
      const alpha3_conversion = alpha3_conversion_object['alpha-3'];
      const countryCodeSelected = _.includes(newState.selectedCountries, alpha3_conversion);
      //console.log('country map', countryMap);
      countryCodeSelected ? _.pull(newState.selectedCountries, alpha3_conversion) : newState.selectedCountries.push(alpha3_conversion);
      return newState;
    }
    // case UPDATE_ATTRIBUTE_SET_FOR_COUNTRY: {
    //   const newState = _.cloneDeep(state);
    //   return newState;
    // }
    case UPDATE_COLOR_MAP:
      const newState = _.cloneDeep(state);
      newState.colorSet = action.payload;
      console.log('new state color set!', newState.colorSet);
      return newState;
    case UPDATE_ATTRIBUTES_SELECTION: {
      const newState = _.cloneDeep(state);
      return newState;
    }
    case DATA_TRANSFORMS_COMPLETE: {
      const newState = _.cloneDeep(state);
      newState.transformsLoaded = true;
      return newState;
    }

    default:
      return state;

  }
}
