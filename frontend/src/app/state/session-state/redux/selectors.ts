import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SessionState } from '../redux/state';

export const selectSessionState = createFeatureSelector<SessionState>('session');

export const selectToken = createSelector(selectSessionState, s => s.token);
export const selectIsAuthenticated = createSelector(selectSessionState, s => s.isAuthenticated);
export const selectRol = createSelector(selectSessionState, s => s.rol);
export const selectNombre = createSelector(selectSessionState, s => s.nombre);
