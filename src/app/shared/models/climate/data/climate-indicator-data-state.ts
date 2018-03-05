export interface IClimateIndicatorDataState {
  dataData: string;
}
export const initialClimateIndicatorDataState: IClimateIndicatorDataState = {
  dataData: 'some data'
};

export class ClimateIndicatorDataState implements IClimateIndicatorDataState {
  constructor (
    public dataData: string,
  ) {}
}
