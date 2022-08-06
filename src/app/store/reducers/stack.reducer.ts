import { createReducer, on } from "@ngrx/store";
import { ResponseModel } from "src/app/models/responseModel";
import * as StackAction from "../actions/stack.action";


const initialState : ResponseModel = {
    isSuccess:false,
    message:"",
    status:0,
    data:null
};

export const StackReducer = createReducer(
    initialState,
    on(StackAction.GET_STACK_SUCCESS, (state, action) => (action.res.data))
)

