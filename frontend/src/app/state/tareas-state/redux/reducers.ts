import { createReducer, on } from '@ngrx/store';
import { initialTareasState } from './state';
import * as TareasActions from './actions/tareas.actions';

export const tareasReducer = createReducer(
  initialTareasState,
  on(TareasActions.loadTareas, state => ({
    ...state,
    loading: true,
    error: null,
    mutationError: null
  })),
  on(TareasActions.loadTareasSuccess, (state, { proyecto, items, total }) => ({
    ...state,
    loading: false,
    proyecto,
    items,
    total,
    error: null
  })),
  on(TareasActions.loadTareasFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(
    TareasActions.createTarea,
    TareasActions.updateTarea,
    TareasActions.deleteTarea,
    TareasActions.changeTareaEstado,
    state => ({
      ...state,
      mutationError: null
    })
  ),
  on(TareasActions.tareasMutationFailure, (state, { error }) => ({
    ...state,
    mutationError: error
  })),
  on(TareasActions.clearTareasApiErrors, state => ({
    ...state,
    error: null,
    mutationError: null
  }))
);
