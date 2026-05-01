import { createReducer, on } from '@ngrx/store';
import { initialSessionState } from './state';
import * as SessionActions from './actions/session.actions';

export const sessionReducer = createReducer(
  initialSessionState,
  on(SessionActions.loginSuccess, (state, { token, nombre, email, rol }) => ({
    ...state,
    token,
    nombre,
    email,
    rol,
    isAuthenticated: true
  })),
  on(SessionActions.logout, () => ({ ...initialSessionState }))
);
