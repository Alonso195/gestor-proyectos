import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectNombre } from '../../state/session-state/redux/selectors';
import {
  selectResumenData,
  selectResumenError,
  selectResumenLoading
} from '../../state/resumen-state/redux/selectors';
import * as ResumenActions from '../../state/resumen-state/redux/actions/resumen.actions';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="home-container">
      <h2>Bienvenido, {{ nombre$ | async }}</h2>
      <p class="subtitle">Panel de resumen — indicadores en tiempo real desde la API.</p>

      @if (loading()) {
        <div class="loading-row">
          <mat-spinner diameter="40" />
        </div>
      } @else if (error()) {
        <p class="error-msg">{{ error() }}</p>
      }

      <div class="cards-row" [class.dimmed]="loading()">
        <mat-card class="summary-card" routerLink="/proyectos" style="cursor:pointer">
          <mat-card-header>
            <mat-icon mat-card-avatar class="card-icon">folder_open</mat-icon>
            <mat-card-title>Proyectos activos</mat-card-title>
            <mat-card-subtitle>Ver todos →</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content
            ><p class="counter">{{ formatCount(data()?.proyectosActivos) }}</p></mat-card-content
          >
        </mat-card>

        <mat-card class="summary-card warn-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="card-icon warn">warning</mat-icon>
            <mat-card-title>Tareas vencidas</mat-card-title>
            <mat-card-subtitle>Atención requerida</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content
            ><p class="counter warn">{{ formatCount(data()?.tareasVencidas) }}</p></mat-card-content
          >
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="card-icon">assignment</mat-icon>
            <mat-card-title>Tareas pendientes</mat-card-title>
            <mat-card-subtitle>En cola</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content
            ><p class="counter">{{ formatCount(data()?.tareasPendientes) }}</p></mat-card-content
          >
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .home-container {
        padding: 8px 0 16px;
      }
      h2 {
        margin: 0 0 4px;
        font-size: 1.65rem;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .subtitle {
        color: #5c6570;
        margin: 0 0 28px;
        font-size: 1rem;
      }
      .loading-row {
        display: flex;
        justify-content: center;
        padding: 24px 0;
      }
      .error-msg {
        color: #c62828;
        margin: 0 0 16px;
      }
      .cards-row.dimmed {
        opacity: 0.45;
        pointer-events: none;
      }

      .cards-row {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
      }
      .summary-card {
        flex: 1;
        min-width: 220px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border-radius: 12px;
      }
      .summary-card:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }
      .card-icon {
        color: var(--mat-sys-primary);
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
      .card-icon.warn {
        color: #f57c00;
      }
      .counter {
        font-size: 2.8rem;
        font-weight: bold;
        text-align: center;
        margin: 8px 0 0;
        color: var(--mat-sys-primary);
      }
      .counter.warn {
        color: #f57c00;
      }
    `
  ]
})
export class HomeComponent implements OnInit {
  private store = inject(Store);
  nombre$: Observable<string | null> = this.store.select(selectNombre);

  data = this.store.selectSignal(selectResumenData);
  loading = this.store.selectSignal(selectResumenLoading);
  error = this.store.selectSignal(selectResumenError);

  ngOnInit(): void {
    this.store.dispatch(ResumenActions.loadResumen());
  }

  formatCount(value: number | undefined): string {
    if (value === undefined || value === null) return '—';
    return String(value);
  }
}
