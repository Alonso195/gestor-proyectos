import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';
import type { ResumenApiResponse } from '../../../../features/home/models/resumen.models';
import * as ResumenActions from '../actions/resumen.actions';

@Injectable()
export class ResumenEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  loadResumen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResumenActions.loadResumen),
      switchMap(() =>
        this.http.get<ResumenApiResponse>(`${environment.apiUrl}/resumen`).pipe(
          map(res => {
            const data = res.data;
            if (!data) {
              return ResumenActions.loadResumenFailure({ error: 'Respuesta inválida del servidor.' });
            }
            return ResumenActions.loadResumenSuccess({ data });
          }),
          catchError((err: HttpErrorResponse) => {
            const msg = err.error?.message ?? err.message ?? 'Error al cargar resumen';
            this.snackBar.open(msg, 'Cerrar', { duration: 5000 });
            return of(ResumenActions.loadResumenFailure({ error: msg }));
          })
        )
      )
    )
  );
}
