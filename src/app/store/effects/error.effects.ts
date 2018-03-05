import { Injectable } from '@angular/core';
import { Actions, Effect} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/switchMap';
import "rxjs/add/operator/do";


@Injectable()
export class WBDataAPIService {

    constructor(private action$: Actions) {}


}
