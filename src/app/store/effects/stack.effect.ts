import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { HttpService } from "src/app/services/http.service";
import * as StackAction from "../actions/stack.action";

@Injectable()
export class StackEffects {
    constructor(private actions : Actions, private service: HttpService){        
    }

    StackData = createEffect(() => this.actions.pipe(
        ofType(StackAction.GET_STACK),
        switchMap(() => this.service.getAll('Setting/GetStakeLimit').pipe(
            map(res => StackAction.GET_STACK_SUCCESS({res}))
        ))
    ))

}