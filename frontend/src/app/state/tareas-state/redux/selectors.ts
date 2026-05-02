import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TareasState } from './state';

export const selectTareasState = createFeatureSelector<TareasState>('tareas');

export const selectTareasProyecto = createSelector(selectTareasState, s => s.proyecto);
export const selectTareas = createSelector(selectTareasState, s => s.items);
export const selectTareasTotal = createSelector(selectTareasState, s => s.total);
export const selectTareasLoading = createSelector(selectTareasState, s => s.loading);
export const selectTareasError = createSelector(selectTareasState, s => s.error);
export const selectTareasMutationError = createSelector(selectTareasState, s => s.mutationError);
