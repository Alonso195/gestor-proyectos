import { createAction, props } from '@ngrx/store';
import type { ResumenDto } from '../../../../features/home/models/resumen.models';

export const loadResumen = createAction('[Resumen] Load');

export const loadResumenSuccess = createAction(
  '[Resumen] Load Success',
  props<{ data: ResumenDto }>()
);

export const loadResumenFailure = createAction(
  '[Resumen] Load Failure',
  props<{ error: string }>()
);
