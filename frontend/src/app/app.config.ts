import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { sessionReducer } from './state/session-state/redux/reducers';
import { SessionEffects } from './state/session-state/redux/effects/session.effects';
import { proyectosReducer } from './state/proyectos-state/redux/reducers';
import { ProyectosEffects } from './state/proyectos-state/redux/effects/proyectos.effects';
import { resumenReducer } from './state/resumen-state/redux/reducers';
import { ResumenEffects } from './state/resumen-state/redux/effects/resumen.effects';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([jwtInterceptor, httpErrorInterceptor])),
    provideStore({ session: sessionReducer, proyectos: proyectosReducer, resumen: resumenReducer }),
    provideEffects([SessionEffects, ProyectosEffects, ResumenEffects]),
    provideStoreDevtools({ maxAge: 25 })
  ]
};
