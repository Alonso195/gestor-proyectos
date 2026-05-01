import { createReducer, on } from '@ngrx/store';
import { initialProyectosState } from '../state';
import * as ProyectosActions from '../actions/proyectos.actions';

export const proyectosReducer = createReducer(
  initialProyectosState,
  on(ProyectosActions.loadProyectos, state => ({ ...state, loading: true, error: null })),
  on(ProyectosActions.loadProyectosSuccess, (state, { items, total }) => ({
    ...state, loading: false, items, total
  })),
  on(ProyectosActions.loadProyectosFailure, (state, { error }) => ({
    ...state, loading: false, error
  }))
);
