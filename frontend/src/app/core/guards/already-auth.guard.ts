import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { selectIsAuthenticated } from '../../state/session-state/redux/selectors';

/**
 * TODO: Implement AlreadyAuthGuard.
 *
 * This guard protects routes that should NOT be accessible when the user is
 * already authenticated (e.g. the /login route).
 *
 * Requirements:
 *   - Read authentication state from the NgRx store using `selectIsAuthenticated`
 *   - If the user IS already authenticated → redirect to /home and return false
 *   - If the user is NOT authenticated     → allow navigation and return true
 *
 * Apply this guard to the /login route in app.routes.ts.
 */
export const alreadyAuthGuard: CanActivateFn = () => {
  // TODO: implement
  return true;
};
