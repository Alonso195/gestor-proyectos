import { inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import * as ProyectosActions from '../redux/actions/proyectos.actions';

@Injectable()
export class ProyectosEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);

  // TODO: Implement NgRx effects for Proyectos.
  //
  // Required effects:
  //   loadProyectos$   — listens for loadProyectos, calls GET /api/proyectos?pagina=&tamanoPagina=
  //                      dispatches loadProyectosSuccess or loadProyectosFailure
  //   createProyecto$  — listens for createProyecto, calls POST /api/proyectos
  //   updateProyecto$  — listens for updateProyecto, calls PUT /api/proyectos/:id
  //   deleteProyecto$  — listens for deleteProyecto, calls DELETE /api/proyectos/:id
  //
  // Use the same pattern as SessionEffects (see session-state/redux/effects/session.effects.ts).
  // All HTTP calls should go through the injected HttpClient.
  // Use environment.apiUrl as the base URL.
}
