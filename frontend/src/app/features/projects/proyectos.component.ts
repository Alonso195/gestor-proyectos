import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import * as ProyectosActions from '../../state/proyectos-state/redux/actions/proyectos.actions';
import {
  selectProyectos,
  selectProyectosTotal,
  selectProyectosLoading,
  selectProyectosError,
  selectProyectosMutationError
} from '../../state/proyectos-state/redux/selectors';
import { selectRol } from '../../state/session-state/redux/selectors';
import { ProyectoDto } from './models/proyecto.models';
import { ProyectoFormDialogComponent } from './proyecto-form-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCardModule,
    RouterLink
  ],
  template: `
    <div class="page">
      @if (listError()) {
        <div class="api-errors-panel" role="alert">
          <div class="api-errors-head">
            <mat-icon class="api-errors-icon">error_outline</mat-icon>
            <span class="api-errors-title">No se pudo cargar el listado</span>
            <button mat-button type="button" class="api-errors-dismiss" (click)="clearApiErrors()">
              Cerrar
            </button>
          </div>
          <pre class="api-errors-body">{{ listError() }}</pre>
        </div>
      }
      @if (mutationError()) {
        <div class="api-errors-panel api-errors-panel--warn" role="alert">
          <div class="api-errors-head">
            <mat-icon class="api-errors-icon">warning_amber</mat-icon>
            <span class="api-errors-title">La operación no se completó</span>
            <button mat-button type="button" class="api-errors-dismiss" (click)="clearApiErrors()">
              Cerrar
            </button>
          </div>
          <pre class="api-errors-body">{{ mutationError() }}</pre>
        </div>
      }

      <div class="toolbar">
        <div class="heading">
          <h1>Proyectos</h1>
          <p class="lede">Listado de proyectos.</p>
        </div>
        @if (isAdmin()) {
          <button mat-flat-button color="primary" type="button" class="cta" (click)="openCreate()">
            <mat-icon>add</mat-icon>
            Nuevo proyecto
          </button>
        }
      </div>

      @if (loading()) {
        <div class="loading"><mat-spinner diameter="44" /></div>
      }

      <mat-card class="data-card" appearance="outlined">
        <mat-card-content class="data-card-inner">
          <div class="table-wrap" [class.dimmed]="loading()">
            <div class="table-scroll">
              <table mat-table [dataSource]="items()" class="proyectos-table">
                <ng-container matColumnDef="nombre">
                  <th mat-header-cell *matHeaderCellDef>Nombre</th>
                  <td mat-cell *matCellDef="let row" class="cell-strong">{{ row.nombre }}</td>
                </ng-container>
                <ng-container matColumnDef="estado">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let row">
                    <span class="estado-pill">{{ row.estadoNombre }}</span>
                  </td>
                </ng-container>
                <ng-container matColumnDef="inicio">
                  <th mat-header-cell *matHeaderCellDef>Inicio</th>
                  <td mat-cell *matCellDef="let row">{{ row.fechaInicio | date: 'mediumDate' }}</td>
                </ng-container>
                <ng-container matColumnDef="fin">
                  <th mat-header-cell *matHeaderCellDef>Fin</th>
                  <td mat-cell *matCellDef="let row">{{ row.fechaFin | date: 'mediumDate' }}</td>
                </ng-container>
                <ng-container matColumnDef="creador">
                  <th mat-header-cell *matHeaderCellDef>Creado por</th>
                  <td mat-cell *matCellDef="let row">{{ row.creadoPorNombre }}</td>
                </ng-container>
                <ng-container matColumnDef="acciones">
                  <th mat-header-cell *matHeaderCellDef class="col-acciones">Acciones</th>
                  <td mat-cell *matCellDef="let row" class="col-acciones">
                    <a mat-stroked-button [routerLink]="['/proyectos', row.id, 'tareas']">Tareas</a>
                    @if (isAdmin()) {
                      <button mat-icon-button type="button" (click)="openEdit(row)" aria-label="Editar">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button type="button" (click)="confirmDelete(row)" aria-label="Eliminar">
                        <mat-icon>delete</mat-icon>
                      </button>
                    }
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumns" class="header-row"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns" class="data-row"></tr>
              </table>
            </div>

            <mat-paginator
              class="paginator-bar"
              [length]="total()"
              [pageIndex]="pageIndex"
              [pageSize]="pageSize"
              [pageSizeOptions]="[5, 10, 25]"
              (page)="onPage($event)"
              showFirstLastButtons
            />
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .page {
        padding: 4px 0 8px;
      }
      .api-errors-panel {
        margin-bottom: 16px;
        padding: 12px 14px;
        border-radius: 10px;
        border: 1px solid #f5c6cb;
        background: #fef2f2;
        color: #7f1d1d;
      }
      .api-errors-panel--warn {
        border-color: #fcd34d;
        background: #fffbeb;
        color: #78350f;
      }
      .api-errors-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .api-errors-icon {
        flex-shrink: 0;
      }
      .api-errors-title {
        flex: 1;
        font-weight: 600;
        font-size: 0.95rem;
      }
      .api-errors-dismiss {
        flex-shrink: 0;
        margin-left: auto;
      }
      .api-errors-body {
        margin: 0;
        font-family: inherit;
        font-size: 0.9rem;
        line-height: 1.45;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .toolbar {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 20px;
        flex-wrap: wrap;
        margin-bottom: 22px;
      }
      .heading h1 {
        margin: 0 0 6px;
        font-size: 1.65rem;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .lede {
        margin: 0;
        color: #5c6570;
        font-size: 0.95rem;
        max-width: 420px;
        line-height: 1.45;
      }
      .cta mat-icon {
        margin-right: 4px;
      }
      .loading {
        display: flex;
        justify-content: center;
        padding: 32px;
      }
      .data-card {
        border-radius: 14px;
        overflow: hidden;
        box-shadow:
          0 1px 3px rgba(0, 0, 0, 0.06),
          0 12px 28px rgba(15, 23, 42, 0.06);
        border-color: rgba(0, 0, 0, 0.08);
      }
      .data-card-inner {
        padding: 0 !important;
      }
      .table-wrap {
        position: relative;
      }
      .table-wrap.dimmed {
        opacity: 0.5;
        pointer-events: none;
      }
      .table-scroll {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      .proyectos-table {
        width: 100%;
        background: #fff;
      }
      .header-row {
        background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
      }
      .proyectos-table .mat-mdc-header-cell {
        font-weight: 600;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #475569;
        border-bottom: 1px solid #e2e8f0;
      }
      .data-row .mat-mdc-cell {
        border-bottom-color: #f1f5f9;
      }
      .data-row:hover {
        background-color: #f8fafc;
      }
      .cell-strong {
        font-weight: 500;
        color: #1e293b;
      }
      .estado-pill {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 500;
        background: #e0e7ff;
        color: #3730a3;
      }
      .col-acciones {
        text-align: right;
        white-space: nowrap;
      }
      .col-acciones .mat-mdc-button-base {
        margin-left: 4px;
      }
      .paginator-bar {
        border-top: 1px solid #e2e8f0;
        background: #fafbfc;
      }
    `
  ]
})
export class ProyectosComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  displayedColumns = ['nombre', 'estado', 'inicio', 'fin', 'creador', 'acciones'];

  items = this.store.selectSignal(selectProyectos);
  total = this.store.selectSignal(selectProyectosTotal);
  loading = this.store.selectSignal(selectProyectosLoading);
  listError = this.store.selectSignal(selectProyectosError);
  mutationError = this.store.selectSignal(selectProyectosMutationError);
  rol = this.store.selectSignal(selectRol);

  pageIndex = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.dispatchLoad();
  }

  isAdmin(): boolean {
    return this.rol() === 'Administrador';
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.dispatchLoad();
  }

  openCreate(): void {
    const ref = this.dialog.open(ProyectoFormDialogComponent, {
      data: { proyecto: null as ProyectoDto | null },
      width: '520px'
    });
    ref.afterClosed().subscribe(payload => {
      if (!payload) return;
      this.store.dispatch(
        ProyectosActions.createProyecto({
          payload,
          pagina: 1,
          tamanoPagina: this.pageSize
        })
      );
      this.pageIndex = 0;
    });
  }

  openEdit(row: ProyectoDto): void {
    const ref = this.dialog.open(ProyectoFormDialogComponent, {
      data: { proyecto: row },
      width: '520px'
    });
    ref.afterClosed().subscribe(payload => {
      if (!payload) return;
      this.store.dispatch(
        ProyectosActions.updateProyecto({
          id: row.id,
          payload,
          pagina: this.pageIndex + 1,
          tamanoPagina: this.pageSize
        })
      );
    });
  }

  confirmDelete(row: ProyectoDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar proyecto',
        message: `¿Eliminar «${row.nombre}»? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar'
      },
      width: '400px'
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.store.dispatch(
        ProyectosActions.deleteProyecto({
          id: row.id,
          pagina: this.pageIndex + 1,
          tamanoPagina: this.pageSize
        })
      );
    });
  }

  clearApiErrors(): void {
    this.store.dispatch(ProyectosActions.clearProyectosApiErrors());
  }

  private dispatchLoad(): void {
    this.store.dispatch(
      ProyectosActions.loadProyectos({
        pagina: this.pageIndex + 1,
        tamanoPagina: this.pageSize
      })
    );
  }
}
