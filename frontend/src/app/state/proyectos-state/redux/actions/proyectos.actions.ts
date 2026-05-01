import { createAction, props } from '@ngrx/store';

export const loadProyectos = createAction(
  '[Proyectos] Load',
  props<{ pagina: number; tamanoPagina: number }>()
);

export const loadProyectosSuccess = createAction(
  '[Proyectos] Load Success',
  props<{ items: any[]; total: number }>()
);

export const loadProyectosFailure = createAction(
  '[Proyectos] Load Failure',
  props<{ error: string }>()
);
