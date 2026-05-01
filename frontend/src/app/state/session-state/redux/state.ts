export interface SessionState {
  token: string | null;
  nombre: string | null;
  email: string | null;
  rol: string | null;
  isAuthenticated: boolean;
}

export const initialSessionState: SessionState = {
  token: null,
  nombre: null,
  email: null,
  rol: null,
  isAuthenticated: false
};
