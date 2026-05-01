 import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectRol } from '../../state/session-state/redux/selectors';

/**
 * TODO: Implement RoleGuard.
 *
 * This guard should protect routes based on the authenticated user's role.
 * Allowed roles are passed via route data: `data: { roles: ['Administrador'] }`.
 *
 * Requirements:
 *   - Read the current user's role from the NgRx store using `selectRol`
 *   - If the user's role is NOT in the allowed list, redirect to `/forbidden` and return false
 *   - If the user's role IS allowed, return true
 *   - The Observable returned must complete
 */
export const roleGuard: CanActivateFn = (route) => {
  const store = inject(Store);
  const router = inject(Router);

  const allowedRoles: string[] = route.data?.['roles'] ?? [];

  return store.select(selectRol).pipe(
    map((rol: string | null) => {
      if (!rol || !allowedRoles.includes(rol)) {
        router.navigate(['/forbidden']);
        return false;
      }
      return true;
    })
  );
};
