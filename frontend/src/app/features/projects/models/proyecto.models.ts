export interface ProyectoDto {
  id: number;
  nombre: string;
  descripcion: string | null;
  fechaInicio: string;
  fechaFin: string;
  estadoId: number;
  estadoNombre: string;
  creadoPorId: number;
  creadoPorNombre: string;
  fechaCreacion: string;
}

export interface PagedResultDto<T> {
  items: T[];
  total: number;
  pagina: number;
  tamanoPagina: number;
  totalPaginas: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface SaveProyectoPayload {
  nombre: string;
  descripcion: string | null;
  fechaInicio: string;
  fechaFin: string;
  estadoId: number;
}

export const ESTADOS_PROYECTO = [
  { id: 1, nombre: 'Pendiente' },
  { id: 2, nombre: 'En Progreso' },
  { id: 3, nombre: 'Completada' },
  { id: 4, nombre: 'Cancelada' }
] as const;
