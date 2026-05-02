import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { formatHttpApiError } from '../../../../core/utils/api-error.util';
import type { ApiResponse, PagedResultDto, TareaDto } from '../../../../features/tasks/models/tarea.models';
import type { ProyectoDto } from '../../../../features/projects/models/proyecto.models';
import * as TareasActions from '../actions/tareas.actions';

@Injectable()
export class TareasEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadTareas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TareasActions.loadTareas),
      switchMap(({ proyectoId, pagina, tamanoPagina }) =>
        forkJoin({
          proyecto: this.http.get<ApiResponse<ProyectoDto>>(
            `${environment.apiUrl}/proyectos/${proyectoId}`
          ),
          tareas: this.http.get<ApiResponse<PagedResultDto<TareaDto>>>(
            `${environment.apiUrl}/tareas`,
            {
              params: {
                proyectoId: String(proyectoId),
                pagina: String(pagina),
                tamanoPagina: String(tamanoPagina)
              }
            }
          )
        }).pipe(
          map(({ proyecto, tareas }) => {
            const p = proyecto.data;
            const t = tareas.data;
            if (!p || !t) {
              return TareasActions.loadTareasFailure({
                error: 'Respuesta inválida del servidor.'
              });
            }
            return TareasActions.loadTareasSuccess({
              proyecto: p,
              items: t.items,
              total: t.total
            });
          }),
          catchError((err: HttpErrorResponse) =>
            of(
              TareasActions.loadTareasFailure({
                error: formatHttpApiError(err)
              })
            )
          )
        )
      )
    )
  );

  createTarea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TareasActions.createTarea),
      switchMap(({ proyectoId, payload, pagina, tamanoPagina }) =>
        this.http
          .post<ApiResponse<TareaDto>>(`${environment.apiUrl}/tareas`, {
            proyectoId,
            ...payload
          })
          .pipe(
            map(() => TareasActions.loadTareas({ proyectoId, pagina, tamanoPagina })),
            catchError((err: HttpErrorResponse) =>
              of(TareasActions.tareasMutationFailure({ error: formatHttpApiError(err) }))
            )
          )
      )
    )
  );

  updateTarea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TareasActions.updateTarea),
      switchMap(({ id, proyectoId, payload, pagina, tamanoPagina }) =>
        this.http.put<ApiResponse<TareaDto>>(`${environment.apiUrl}/tareas/${id}`, payload).pipe(
          map(() => TareasActions.loadTareas({ proyectoId, pagina, tamanoPagina })),
          catchError((err: HttpErrorResponse) =>
            of(TareasActions.tareasMutationFailure({ error: formatHttpApiError(err) }))
          )
        )
      )
    )
  );

  deleteTarea$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TareasActions.deleteTarea),
      switchMap(({ id, proyectoId, pagina, tamanoPagina }) =>
        this.http.delete<ApiResponse<unknown>>(`${environment.apiUrl}/tareas/${id}`).pipe(
          map(() => TareasActions.loadTareas({ proyectoId, pagina, tamanoPagina })),
          catchError((err: HttpErrorResponse) =>
            of(TareasActions.tareasMutationFailure({ error: formatHttpApiError(err) }))
          )
        )
      )
    )
  );

  changeEstado$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TareasActions.changeTareaEstado),
      switchMap(({ id, proyectoId, estadoId, pagina, tamanoPagina }) =>
        this.http
          .patch<ApiResponse<TareaDto>>(`${environment.apiUrl}/tareas/${id}/estado`, { estadoId })
          .pipe(
            map(() => TareasActions.loadTareas({ proyectoId, pagina, tamanoPagina })),
            catchError((err: HttpErrorResponse) =>
              of(TareasActions.tareasMutationFailure({ error: formatHttpApiError(err) }))
            )
          )
      )
    )
  );
}
