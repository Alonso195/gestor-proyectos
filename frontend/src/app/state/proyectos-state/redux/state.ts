export interface ProyectosState {
  items: any[];
  total: number;
  loading: boolean;
  error: string | null;
}

export const initialProyectosState: ProyectosState = {
  items: [],
  total: 0,
  loading: false,
  error: null
};
