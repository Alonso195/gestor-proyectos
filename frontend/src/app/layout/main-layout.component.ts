import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectNombre, selectRol } from '../state/session-state/redux/selectors';
import * as SessionActions from '../state/session-state/redux/actions/session.actions';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="app-shell">
      <mat-toolbar class="top-bar">
        <span class="app-title">Gestión de Proyectos</span>
        <span class="spacer"></span>
        <nav class="nav-links" aria-label="Principal">
          <a mat-button routerLink="/home" routerLinkActive="active-link">
            <mat-icon class="nav-icon">dashboard</mat-icon>
            Inicio
          </a>
          <a
            mat-button
            routerLink="/proyectos"
            routerLinkActive="active-link"
            [routerLinkActiveOptions]="{ exact: false }"
          >
            <mat-icon class="nav-icon">folder</mat-icon>
            Proyectos
          </a>
        </nav>
        <span class="user-info">
          <mat-chip class="rol-chip">{{ rol$ | async }}</mat-chip>
          <span class="nombre">{{ nombre$ | async }}</span>
        </span>
        <button mat-icon-button type="button" class="logout-btn" (click)="logout()" title="Cerrar sesión">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .app-shell {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: linear-gradient(165deg, #f0f4f8 0%, #e8eef5 45%, #f5f7fa 100%);
      }
      .top-bar {
        position: sticky;
        top: 0;
        z-index: 100;
        background: #ffffff !important;
        color: #0a0a0a;
        border-bottom: 1px solid #e5e7eb;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
      }
      .app-title {
        font-weight: 600;
        font-size: 1.1rem;
        letter-spacing: 0.02em;
        color: #0a0a0a;
      }
      .spacer {
        flex: 1;
      }
      .nav-links {
        display: flex;
        align-items: center;
        gap: 2px;
        margin: 0 12px;
      }
      .nav-links a.mat-mdc-button {
        color: #0a0a0a !important;
        border-radius: 8px;
      }
      .nav-links a .mdc-button__label,
      .nav-links a .mat-mdc-button-touch-target {
        color: inherit;
      }
      .nav-icon {
        color: #0a0a0a !important;
        margin-right: 6px;
      }
      .nav-links a.active-link {
        background: #e8e8e8;
      }
      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-right: 4px;
      }
      .rol-chip {
        --mdc-chip-elevated-container-color: #e5e7eb;
        --mdc-chip-label-text-color: #111827;
      }
      .nombre {
        font-size: 0.9rem;
        color: #111827;
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .logout-btn {
        color: #0a0a0a !important;
      }
      .logout-btn mat-icon {
        color: #0a0a0a !important;
      }
      .main-content {
        flex: 1;
        width: 100%;
        max-width: 1320px;
        margin: 0 auto;
        padding: 24px 28px 36px;
        box-sizing: border-box;
      }
      @media (max-width: 599px) {
        .main-content {
          padding: 16px 16px 28px;
        }
        .nav-links {
          margin: 0 4px;
        }
      }
    `
  ]
})
export class MainLayoutComponent {
  private store = inject(Store);
  nombre$: Observable<string | null> = this.store.select(selectNombre);
  rol$: Observable<string | null> = this.store.select(selectRol);

  logout(): void {
    this.store.dispatch(SessionActions.logout());
  }
}
