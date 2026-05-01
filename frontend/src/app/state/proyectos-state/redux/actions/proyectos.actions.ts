import { createAction, props } from '@ngrx/store';
import type { SaveProyectoPayload } from '../../../../features/projects/models/proyecto.models';

export const loadProyectos = createAction(
  '[Proyectos] Load',
  props<{ pagina: number; tamanoPagina: number }>()
);

export const loadProyectosSuccess = createAction(
  '[Proyectos] Load Success',
  props<{ items: unknown[]; total: number }>()
);

export const loadProyectosFailure = createAction(
  '[Proyectos] Load Failure',
  props<{ error: string }>()
);

export const createProyecto = createAction(
  '[Proyectos] Create',
  props<{ payload: SaveProyectoPayload; pagina: number; tamanoPagina: number }>()
);

export const updateProyecto = createAction(
  '[Proyectos] Update',
  props<{ id: number; payload: SaveProyectoPayload; pagina: number; tamanoPagina: number }>()
);

export const deleteProyecto = createAction(
  '[Proyectos] Delete',
  props<{ id: number; pagina: number; tamanoPagina: number }>()
);

export const proyectosMutationFailure = createAction(
  '[Proyectos] Mutation Failure',
  props<{ error: string }>()
);

export const clearProyectosApiErrors = createAction('[Proyectos] Clear API Errors');
