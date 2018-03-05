import { Action } from '@ngrx/store';

// UI Errors
export const ERROR_EMPTY_INPUT_ACTION = 'ERROR_EMPTY_INPUT_ACTION';

// API Errors
export const ERROR_API_ACTION = 'ERROR_API_ACTION';

export class ErrorEmptyInputAction implements Action {
    readonly type = ERROR_EMPTY_INPUT_ACTION;
    constructor(public payload?: any) {}
}

export class ErrorApiAction implements Action {
    readonly type = ERROR_API_ACTION;
    constructor(public payload?: any) {}
}
