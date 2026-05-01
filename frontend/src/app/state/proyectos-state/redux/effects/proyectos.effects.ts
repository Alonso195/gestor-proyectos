import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, map, of, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { formatHttpApiError } from '../../../../core/utils/api-error.util';
import type { ApiResponse, PagedResultDto, ProyectoDto } from '../../../../features/projects/models/proyecto.models';
import * as ProyectosActions from '../actions/proyectos.actions';

@Injectable()
export class ProyectosEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  loadProyectos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProyectosActions.loadProyectos),
      switchMap(({ pagina, tamanoPagina }) =>
        this.http
          .get<ApiResponse<PagedResultDto<ProyectoDto>>>(`${environment.apiUrl}/proyectos`, {
            params: { pagina: String(pagina), tamanoPagina: String(tamanoPagina) }
          })
          .pipe(
            map(res => {
              const data = res.data;
              if (!data) {
                return ProyectosActions.loadProyectosFailure({ error: 'Respuesta inválida del servidor.' });
              }
              return ProyectosActions.loadProyectosSuccess({
                items: data.items,
                total: data.total
              });
            }),
            catchError((err: HttpErrorResponse) =>
              of(
                ProyectosActions.loadProyectosFailure({
                  error: formatHttpApiError(err)
                })
              )
            )
          )
      )
    )
  );

  createProyecto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProyectosActions.createProyecto),
      switchMap(({ payload, pagina, tamanoPagina }) =>
        this.http.post<ApiResponse<ProyectoDto>>(`${environment.apiUrl}/proyectos`, payload).pipe(
          map(() => ProyectosActions.loadProyectos({ pagina, tamanoPagina })),
          catchError((err: HttpErrorResponse) =>
            of(ProyectosActions.proyectosMutationFailure({ error: formatHttpApiError(err) }))
          )
        )
      )
    )
  );

  updateProyecto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProyectosActions.updateProyecto),
      switchMap(({ id, payload, pagina, tamanoPagina }) =>
        this.http.put<ApiResponse<ProyectoDto>>(`${environment.apiUrl}/proyectos/${id}`, payload).pipe(
          map(() => ProyectosActions.loadProyectos({ pagina, tamanoPagina })),
          catchError((err: HttpErrorResponse) =>
            of(ProyectosActions.proyectosMutationFailure({ error: formatHttpApiError(err) }))
          )
        )
      )
    )
  );

  deleteProyecto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProyectosActions.deleteProyecto),
      switchMap(({ id, pagina, tamanoPagina }) =>
        this.http.delete<ApiResponse<unknown>>(`${environment.apiUrl}/proyectos/${id}`).pipe(
          map(() => ProyectosActions.loadProyectos({ pagina, tamanoPagina })),
          catchError((err: HttpErrorResponse) =>
            of(ProyectosActions.proyectosMutationFailure({ error: formatHttpApiError(err) }))
          )
        )
      )
    )
  );
}
