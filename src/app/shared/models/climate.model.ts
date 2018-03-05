import {IClimateIndicatorState, initialClimateIndicatorState} from "./climate/climate-indicators-model";

export interface ClimateModel {
  climateIndicatorData: IClimateIndicatorState;
}

export const initialClimateState = {
  climateIndicatorData: initialClimateIndicatorState
};
