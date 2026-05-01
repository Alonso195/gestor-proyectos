import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

/**
 * TODO: Implement HTTP error interceptor.
 *
 * This interceptor should handle error responses globally:
 *
 *   - 401 Unauthorized  → dispatch logout action to the NgRx store and redirect to /login
 *   - 403 Forbidden     → redirect to /forbidden
 *   - 500 / network err → display a global error notification (use console.error at minimum,
 *                         or integrate with a snackbar/notification service)
 *
 * The interceptor must:
 *   - Use Angular's functional interceptor signature (HttpInterceptorFn)
 *   - Use `inject()` to get dependencies (Router, Store)
 *   - Re-throw the error after handling so individual components can still react if needed
 *
 * Register it in app.config.ts alongside jwtInterceptor.
 *
 * Example skeleton:
 *
 *   return next(req).pipe(
 *     catchError((error: HttpErrorResponse) => {
 *       // handle by status code
 *       return throwError(() => error);
 *     })
 *   );
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO: implement
  return next(req);
};
