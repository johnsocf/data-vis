

import {CustomAction} from "../actions/custom.action";
import {initialUiState, uIModel} from "../../shared/models/ui.model";
import {UPDATE_ATTRIBUTES_SELECTION, UPDATE_COUNTRIES_SELECTION} from "../actions/ui.actions";
import * as _ from 'lodash';
import {countryMap} from '../../../assets/maps/country-maps';

export function UIStateReducer(state = initialUiState, action: CustomAction): uIModel {
  switch (action.type) {
    case UPDATE_COUNTRIES_SELECTION: {
      const newState = _.cloneDeep(state);
      const alpha3_conversion_object = _.find(countryMap, {'alpha-2': action.payload});
      const alpha3_conversion = alpha3_conversion_object['alpha-3'];
      const countryCodeSelected = _.includes(newState.selectedCountries, alpha3_conversion);
      console.log('country map', countryMap);
      countryCodeSelected ? _.pull(newState.selectedCountries, alpha3_conversion) : newState.selectedCountries.push(alpha3_conversion);
      return newState;
    }
    case UPDATE_ATTRIBUTES_SELECTION: {
      const newState = _.cloneDeep(state);
      return newState;
    }

    default:
      return state;

  }
}
