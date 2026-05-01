import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { first, switchMap } from 'rxjs';
import { selectToken } from '../../state/session-state/redux/selectors';

/**
 * JWT Interceptor — attaches the Bearer token to outgoing HTTP requests.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(selectToken).pipe(
    first(),
    switchMap(token => {
      if (token) {
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};
