import * as fromRouter from '@ngrx/router-store';
import {ClimateModel, initialClimateState} from "../shared/models/climate.model";
import {uIModel} from "../shared/models/ui.model";
export const INITIAL_APPLICATION_STATE = {
    climateData: initialClimateState
};

export interface ApplicationState {
    routerReducer: fromRouter.RouterReducerState;
    climateData: ClimateModel;
    uiModel: uIModel;
}
