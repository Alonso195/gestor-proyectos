import type { ResumenDto } from '../../../features/home/models/resumen.models';

export interface ResumenState {
  data: ResumenDto | null;
  loading: boolean;
  error: string | null;
}

export const initialResumenState: ResumenState = {
  data: null,
  loading: false,
  error: null
};
