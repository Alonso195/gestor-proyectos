import { createAction, props } from '@ngrx/store';
import type { ProyectoDto } from '../../../../features/projects/models/proyecto.models';
import type { SaveTareaPayload, TareaDto } from '../../../../features/tasks/models/tarea.models';

export const loadTareas = createAction(
  '[Tareas] Load',
  props<{ proyectoId: number; pagina: number; tamanoPagina: number }>()
);

export const loadTareasSuccess = createAction(
  '[Tareas] Load Success',
  props<{ proyecto: ProyectoDto; items: TareaDto[]; total: number }>()
);

export const loadTareasFailure = createAction('[Tareas] Load Failure', props<{ error: string }>());

export const createTarea = createAction(
  '[Tareas] Create',
  props<{
    proyectoId: number;
    payload: SaveTareaPayload;
    pagina: number;
    tamanoPagina: number;
  }>()
);

export const updateTarea = createAction(
  '[Tareas] Update',
  props<{
    id: number;
    proyectoId: number;
    payload: SaveTareaPayload;
    pagina: number;
    tamanoPagina: number;
  }>()
);

export const deleteTarea = createAction(
  '[Tareas] Delete',
  props<{ id: number; proyectoId: number; pagina: number; tamanoPagina: number }>()
);

export const changeTareaEstado = createAction(
  '[Tareas] Change Estado',
  props<{
    id: number;
    proyectoId: number;
    estadoId: number;
    pagina: number;
    tamanoPagina: number;
  }>()
);

export const tareasMutationFailure = createAction(
  '[Tareas] Mutation Failure',
  props<{ error: string }>()
);

export const clearTareasApiErrors = createAction('[Tareas] Clear API Errors');
