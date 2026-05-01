import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProyectosState } from './state';

export const selectProyectosState = createFeatureSelector<ProyectosState>('proyectos');

export const selectProyectos = createSelector(selectProyectosState, s => s.items);
export const selectProyectosTotal = createSelector(selectProyectosState, s => s.total);
export const selectProyectosLoading = createSelector(selectProyectosState, s => s.loading);
export const selectProyectosError = createSelector(selectProyectosState, s => s.error);
export const selectProyectosMutationError = createSelector(selectProyectosState, s => s.mutationError);
