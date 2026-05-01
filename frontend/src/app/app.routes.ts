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
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'proyectos',
        loadComponent: () =>
          import('./features/projects/proyectos.component').then(m => m.ProyectosComponent)
      },
      {
        path: 'proyectos/:proyectoId/tareas',
        loadComponent: () =>
          import('./features/tasks/tareas.component').then(m => m.TareasComponent)
      }
    ]
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  { path: '**', redirectTo: 'home' }
];
