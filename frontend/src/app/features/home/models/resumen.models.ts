import type { ApiResponse } from '../../projects/models/proyecto.models';

export interface ResumenDto {
  proyectosActivos: number;
  tareasVencidas: number;
  tareasPendientes: number;
}

export type ResumenApiResponse = ApiResponse<ResumenDto>;
