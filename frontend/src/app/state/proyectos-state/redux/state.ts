export interface ProyectosState {
  items: any[];
  total: number;
  loading: boolean;
  /** Error al cargar el listado (GET). */
  error: string | null;
  /** Error en crear / actualizar / eliminar (mutaciones). */
  mutationError: string | null;
}

export const initialProyectosState: ProyectosState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  mutationError: null
};
