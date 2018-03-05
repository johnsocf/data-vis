export interface IClimateIndicatorUIState {
  uiData: string;
}
export const initialClimateIndicatorUIState: IClimateIndicatorUIState = {
  uiData: 'some data'
};

export class ClimateIndicatorUIState implements IClimateIndicatorUIState {
  constructor (
    public uiData: string,
  ) {}
}
