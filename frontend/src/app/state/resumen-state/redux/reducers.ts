import { createReducer, on } from '@ngrx/store';
import { initialResumenState } from './state';
import * as ResumenActions from './actions/resumen.actions';

export const resumenReducer = createReducer(
  initialResumenState,
  on(ResumenActions.loadResumen, state => ({ ...state, loading: true, error: null })),
  on(ResumenActions.loadResumenSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    data
  })),
  on(ResumenActions.loadResumenFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
