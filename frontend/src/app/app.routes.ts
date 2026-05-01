import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { alreadyAuthGuard } from './core/guards/already-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [alreadyAuthGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'proyectos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/projects/proyectos.component').then(m => m.ProyectosComponent)
  },
  {
    path: 'proyectos/:proyectoId/tareas',
    canActivate: [authGuard],
    // TODO: Add roleGuard here to restrict access based on role if needed
    loadComponent: () =>
      import('./features/tasks/tareas.component').then(m => m.TareasComponent)
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
    // TODO: Create a proper ForbiddenComponent
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
