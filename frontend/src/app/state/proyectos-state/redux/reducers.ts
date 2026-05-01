import { createReducer, on } from '@ngrx/store';
import { initialProyectosState } from './state';
import * as ProyectosActions from './actions/proyectos.actions';

export const proyectosReducer = createReducer(
  initialProyectosState,
  on(ProyectosActions.loadProyectos, state => ({
    ...state,
    loading: true,
    error: null,
    mutationError: null
  })),
  on(ProyectosActions.loadProyectosSuccess, (state, { items, total }) => ({
    ...state,
    loading: false,
    items,
    total,
    error: null
  })),
  on(ProyectosActions.loadProyectosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(ProyectosActions.createProyecto, ProyectosActions.updateProyecto, ProyectosActions.deleteProyecto, state => ({
    ...state,
    mutationError: null
  })),
  on(ProyectosActions.proyectosMutationFailure, (state, { error }) => ({
    ...state,
    mutationError: error
  })),
  on(ProyectosActions.clearProyectosApiErrors, state => ({
    ...state,
    error: null,
    mutationError: null
  }))
);
