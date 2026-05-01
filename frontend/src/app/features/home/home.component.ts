import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectNombre, selectRol } from '../../state/session-state/redux/selectors';
import * as SessionActions from '../../state/session-state/redux/actions/session.actions';

// TODO: Implement the Home component.
//
// This component should display a summary screen with counters:
//   - Proyectos activos
//   - Tareas vencidas (past FechaLimite and not Completada/Cancelada)
//   - Tareas pendientes
//
// Requirements:
//   - Use NgRx: create actions, effects, reducer and selectors for resumen state
//   - Call GET /api/resumen on init via an NgRx effect
//   - Display the data using Angular Material cards
//   - Show a loading state while the data is being fetched

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    RouterLink,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <!-- Navigation toolbar -->
    <mat-toolbar color="primary">
      <span class="app-title">Gestión de Proyectos</span>
      <span class="spacer"></span>
      <nav class="nav-links">
        <a mat-button routerLink="/home">
          <mat-icon>dashboard</mat-icon> Inicio
        </a>
        <a mat-button routerLink="/proyectos">
          <mat-icon>folder</mat-icon> Proyectos
        </a>
      </nav>
      <span class="user-info">
        <mat-chip [style.background]="'rgba(255,255,255,0.2)'" [style.color]="'white'">
          {{ rol$ | async }}
        </mat-chip>
        <span class="nombre">{{ nombre$ | async }}</span>
      </span>
      <button mat-icon-button (click)="logout()" title="Cerrar sesión">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <!-- Main content -->
    <div class="home-container">
      <h2>Bienvenido, {{ nombre$ | async }}</h2>
      <p class="subtitle">Panel de resumen — conecta con la API para ver los datos reales.</p>

      <!-- TODO: Replace with real counters from NgRx store -->
      <div class="cards-row">
        <mat-card class="summary-card" routerLink="/proyectos" style="cursor:pointer">
          <mat-card-header>
            <mat-icon mat-card-avatar class="card-icon">folder_open</mat-icon>
            <mat-card-title>Proyectos Activos</mat-card-title>
            <mat-card-subtitle>Ver todos →</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content><p class="counter">—</p></mat-card-content>
        </mat-card>

        <mat-card class="summary-card warn-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="card-icon warn">warning</mat-icon>
            <mat-card-title>Tareas Vencidas</mat-card-title>
            <mat-card-subtitle>Atención requerida</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content><p class="counter warn">—</p></mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="card-icon">assignment</mat-icon>
            <mat-card-title>Tareas Pendientes</mat-card-title>
            <mat-card-subtitle>En cola</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content><p class="counter">—</p></mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    mat-toolbar { position: sticky; top: 0; z-index: 100; }
    .app-title { font-weight: 600; font-size: 1.1rem; }
    .spacer { flex: 1; }
    .nav-links { display: flex; gap: 4px; margin: 0 16px; }
    .nav-links a { color: white; }
    .user-info { display: flex; align-items: center; gap: 8px; margin-right: 8px; }
    .nombre { font-size: 0.9rem; opacity: 0.9; }

    .home-container { padding: 32px 24px; }
    h2 { margin: 0 0 4px; font-size: 1.6rem; }
    .subtitle { color: #666; margin: 0 0 24px; }

    .cards-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .summary-card { flex: 1; min-width: 200px; transition: box-shadow 0.2s; }
    .summary-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
    .card-icon { color: var(--mat-sys-primary); font-size: 32px; width: 32px; height: 32px; }
    .card-icon.warn { color: #f57c00; }
    .counter { font-size: 2.8rem; font-weight: bold; text-align: center; margin: 8px 0 0; color: var(--mat-sys-primary); }
    .counter.warn { color: #f57c00; }
  `]
})
export class HomeComponent {
  private store = inject(Store);
  nombre$: Observable<string | null> = this.store.select(selectNombre);
  rol$: Observable<string | null> = this.store.select(selectRol);

  logout(): void {
    this.store.dispatch(SessionActions.logout());
  }
}
