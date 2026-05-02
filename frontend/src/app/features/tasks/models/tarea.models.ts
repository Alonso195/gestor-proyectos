export interface TareaDto {
  id: number;
  proyectoId: number;
  proyectoNombre: string;
  titulo: string;
  descripcion: string | null;
  prioridadId: number;
  prioridadNombre: string;
  estadoId: number;
  estadoNombre: string;
  usuarioAsignadoId: number | null;
  usuarioAsignadoNombre: string | null;
  fechaLimite: string;
  fechaCreacion: string;
}

export interface SaveTareaPayload {
  titulo: string;
  descripcion: string | null;
  prioridadId: number;
  usuarioAsignadoId: number | null;
  fechaLimite: string;
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

/** Usuarios de ejemplo (seed en database/init.sql). */
export const USUARIOS_ASIGNABLES = [
  { id: 1, nombre: 'Carlos Admin' },
  { id: 2, nombre: 'María Colaborador' },
  { id: 3, nombre: 'Juan Visualizador' }
] as const;

export const PRIORIDADES_TAREA = [
  { id: 1, nombre: 'Baja' },
  { id: 2, nombre: 'Media' },
  { id: 3, nombre: 'Alta' },
  { id: 4, nombre: 'Crítica' }
] as const;

export const ESTADOS_TAREA = [
  { id: 1, nombre: 'Pendiente' },
  { id: 2, nombre: 'En Progreso' },
  { id: 3, nombre: 'Completada' },
  { id: 4, nombre: 'Cancelada' }
] as const;

/** Alineado con reglas del backend (TareaUseCases). */
export function estadosDestinoPermitidos(estadoId: number): { id: number; nombre: string }[] {
  switch (estadoId) {
    case 1:
      return [
        { id: 2, nombre: 'En Progreso' },
        { id: 4, nombre: 'Cancelada' }
      ];
    case 2:
      return [
        { id: 1, nombre: 'Pendiente' },
        { id: 3, nombre: 'Completada' },
        { id: 4, nombre: 'Cancelada' }
      ];
    default:
      return [];
  }
}

export function tareaEstaVencida(row: TareaDto): boolean {
  if (row.estadoId === 3 || row.estadoId === 4) return false;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const lim = new Date(row.fechaLimite.slice(0, 10) + 'T00:00:00');
  return lim < hoy;
}
