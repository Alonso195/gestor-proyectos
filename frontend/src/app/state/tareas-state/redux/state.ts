import type { ProyectoDto } from '../../../features/projects/models/proyecto.models';
import type { TareaDto } from '../../../features/tasks/models/tarea.models';

export interface TareasState {
  proyecto: ProyectoDto | null;
  items: TareaDto[];
  total: number;
  loading: boolean;
  error: string | null;
  mutationError: string | null;
}

export const initialTareasState: TareasState = {
  proyecto: null,
  items: [],
  total: 0,
  loading: false,
  error: null,
  mutationError: null
};
