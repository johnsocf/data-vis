
import { ActionReducerMap } from '@ngrx/store';
import { ApplicationState } from '../application-state';
import * as fromRouter from '@ngrx/router-store';
import {ClimateModel} from "../../shared/models/climate.model";
import {ClimateIndicatorReducer} from "./climate-indicator.reducer";

export interface State {
    routerReducer: fromRouter.RouterReducerState;
    climateData: ClimateModel;
}

export const appReducer: ActionReducerMap<ApplicationState> = {
    climateData: ClimateIndicatorReducer,
    routerReducer: fromRouter.routerReducer
};
