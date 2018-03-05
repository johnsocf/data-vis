import {IClimateIndicatorDataState, initialClimateIndicatorDataState} from "./data/climate-indicator-data-state";
import {IClimateIndicatorUIState, initialClimateIndicatorUIState} from "./view/climate-indicator-ui-state";
export interface IClimateIndicatorState {
  data: IClimateIndicatorDataState,
  uiState: IClimateIndicatorUIState
}
export const initialClimateIndicatorState: IClimateIndicatorState = {
  data: initialClimateIndicatorDataState,
  uiState: initialClimateIndicatorUIState
};

export class ClimateIndicatorState implements IClimateIndicatorState {
  constructor (
    public data: IClimateIndicatorDataState,
    public uiState: IClimateIndicatorUIState
  ) {}
}
