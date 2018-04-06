export interface uIModel {
  selectedCountries: string[];
  selectedAttribute: string;
  colorSet: {}
}

export const initialUiState = {
  selectedCountries: [],
  selectedAttribute: '',
  colorSet: {}
};
