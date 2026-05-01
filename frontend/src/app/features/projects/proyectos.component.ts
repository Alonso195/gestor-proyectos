import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// TODO: Implement the Projects feature.
//
// This module/component should include:
//   1. A paginated list of projects (server-side pagination)
//      - Columns: Nombre, Estado, FechaInicio, FechaFin, CreadoPor, Actions
//      - Use Angular Material table + paginator
//   2. Create project dialog/form (Admin only — hide button for other roles)
//   3. Edit project dialog/form (Admin only)
//   4. Delete project with confirmation dialog (Admin only)
//      — Show error message if backend rejects due to business rule
//
// NgRx requirements:
//   - proyectos state: actions, effects, reducer, selectors
//   - Effects must call the backend API service
//   - Use NgRx selectors in the template (no direct service calls from components)
//
// Role-based UI:
//   - Show/hide action buttons based on current user role from selectRol selector
//   - Colaborador and Visualizador should see read-only list

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule],
  template: `<p>TODO: Implement projects list</p>`
})
export class ProyectosComponent {}
