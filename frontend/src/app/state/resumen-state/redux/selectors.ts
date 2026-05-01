import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { ResumenState } from './state';

export const selectResumenState = createFeatureSelector<ResumenState>('resumen');

export const selectResumenData = createSelector(selectResumenState, s => s.data);

export const selectResumenLoading = createSelector(selectResumenState, s => s.loading);

export const selectResumenError = createSelector(selectResumenState, s => s.error);
