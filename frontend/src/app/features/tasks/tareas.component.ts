import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// TODO: Implement the Tasks feature.
//
// This module/component should include:
//   1. A paginated list of tasks filtered by project (proyectoId from route param)
//      - Columns: Titulo, Estado, Prioridad, UsuarioAsignado, FechaLimite, Actions
//      - Highlight overdue tasks visually (FechaLimite < today and not Completada/Cancelada)
//      - Use Angular Material table + paginator
//   2. Create task form (Admin + Colaborador)
//   3. Edit task form (Admin + Colaborador)
//   4. Delete task (Admin only)
//   5. Change task status (Admin + Colaborador) — dedicated action button
//
// NgRx requirements:
//   - tareas state: actions, effects, reducer, selectors
//   - Effects must call the backend API service
//   - Use NgRx selectors in the template
//
// Business rule enforcement in UI:
//   - When changing status to 'Completada', warn user if project is 'Cancelada'
//   - Status options in dropdown should reflect valid transitions

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule],
  template: `<p>TODO: Implement tasks list</p>`
})
export class TareasComponent {}
