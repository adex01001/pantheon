import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { createStore, combineReducers, applyMiddleware, Store as ReduxStore, Action } from 'redux';
import { AppActionTypes } from "./actions/interfaces";
import { screenManageReducer } from "./reducers/screenManageReducer";
import { mimirClient } from './middlewares/mimirClient';
import { RiichiApiService } from "../riichiApi";

@Injectable()
export class Store {
  private onUpdate: (state) => void;
  private store: ReduxStore;

  constructor(client: HttpClient) {
    this.store = createStore(combineReducers({
      screenManageReducer
    }), applyMiddleware(
      mimirClient(new RiichiApiService(client))
    ));
  }

  public subscribe(onUpdate: (state) => void) {
    this.onUpdate = onUpdate;
    this.store.subscribe(() => this.onUpdate(this.store.getState()));
  }

  public dispatch(action: AppActionTypes) {
    this.store.dispatch(action);
  }
}
