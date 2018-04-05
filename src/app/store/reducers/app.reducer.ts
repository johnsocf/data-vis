
import { ActionReducerMap } from '@ngrx/store';
import { ApplicationState } from '../application-state';
import * as fromRouter from '@ngrx/router-store';
import {ClimateModel} from "../../shared/models/climate.model";
import {ClimateIndicatorReducer} from "./climate-indicator.reducer";
import {UIStateReducer} from "./ui-state.reducer";
import {uIModel} from "../../shared/models/ui.model";

export interface State {
    uiModel: uIModel;
    routerReducer: fromRouter.RouterReducerState;
    climateData: ClimateModel;
}

export const appReducer: ActionReducerMap<ApplicationState> = {
    uiModel: UIStateReducer,
    climateData: ClimateIndicatorReducer,
    routerReducer: fromRouter.routerReducer
};
