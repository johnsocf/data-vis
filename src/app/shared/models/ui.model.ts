export interface uIModel {
  selectedCountries: string[];
  selectedAttribute: string;
  colorSet: {};
  transformsLoaded: boolean;
}

export const initialUiState = {
  selectedCountries: [],
  selectedAttribute: '',
  colorSet: {},
  transformsLoaded: false
};
