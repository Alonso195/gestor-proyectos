import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import * as TareasActions from '../../state/tareas-state/redux/actions/tareas.actions';
import {
  selectTareas,
  selectTareasTotal,
  selectTareasLoading,
  selectTareasError,
  selectTareasMutationError,
  selectTareasProyecto
} from '../../state/tareas-state/redux/selectors';
import { selectRol } from '../../state/session-state/redux/selectors';
import { estadosDestinoPermitidos, TareaDto, tareaEstaVencida } from './models/tarea.models';
import { TareaFormDialogComponent } from './tarea-form-dialog.component';
import { TareaEstadoDialogComponent } from './tarea-estado-dialog.component';
import { ConfirmDialogComponent } from '../projects/confirm-dialog.component';

@Component({
  selector: 'app-tareas',
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
          <a mat-button type="button" routerLink="/proyectos" class="back-link">
            <mat-icon>arrow_back</mat-icon>
            Proyectos
          </a>
          <h1>Tareas</h1>
          @if (proyecto(); as p) {
            <p class="lede">
              Proyecto: <strong>{{ p.nombre }}</strong>
              <span class="estado-pill">{{ p.estadoNombre }}</span>
            </p>
          } @else {
            <p class="lede">Cargando contexto del proyecto…</p>
          }
        </div>
        @if (canMutate()) {
          <button mat-flat-button color="primary" type="button" class="cta" (click)="openCreate()">
            <mat-icon>add</mat-icon>
            Nueva tarea
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
              <table mat-table [dataSource]="items()" class="tareas-table">
                <ng-container matColumnDef="titulo">
                  <th mat-header-cell *matHeaderCellDef>Título</th>
                  <td mat-cell *matCellDef="let row" class="cell-strong">{{ row.titulo }}</td>
                </ng-container>
                <ng-container matColumnDef="estado">
                  <th mat-header-cell *matHeaderCellDef>Estado</th>
                  <td mat-cell *matCellDef="let row">
                    <span class="estado-pill">{{ row.estadoNombre }}</span>
                  </td>
                </ng-container>
                <ng-container matColumnDef="prioridad">
                  <th mat-header-cell *matHeaderCellDef>Prioridad</th>
                  <td mat-cell *matCellDef="let row">{{ row.prioridadNombre }}</td>
                </ng-container>
                <ng-container matColumnDef="asignado">
                  <th mat-header-cell *matHeaderCellDef>Asignado</th>
                  <td mat-cell *matCellDef="let row">
                    {{ row.usuarioAsignadoNombre ?? '—' }}
                  </td>
                </ng-container>
                <ng-container matColumnDef="fechaLimite">
                  <th mat-header-cell *matHeaderCellDef>Fecha límite</th>
                  <td mat-cell *matCellDef="let row">{{ row.fechaLimite | date: 'mediumDate' }}</td>
                </ng-container>
                <ng-container matColumnDef="acciones">
                  <th mat-header-cell *matHeaderCellDef class="col-acciones">Acciones</th>
                  <td mat-cell *matCellDef="let row" class="col-acciones">
                    @if (canMutate()) {
                      <button
                        mat-stroked-button
                        type="button"
                        (click)="openCambiarEstado(row)"
                        [disabled]="!hayTransiciones(row)"
                      >
                        Estado
                      </button>
                      <button mat-icon-button type="button" (click)="openEdit(row)" aria-label="Editar">
                        <mat-icon>edit</mat-icon>
                      </button>
                    }
                    @if (isAdmin()) {
                      <button mat-icon-button type="button" (click)="confirmDelete(row)" aria-label="Eliminar">
                        <mat-icon>delete</mat-icon>
                      </button>
                    }
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumns" class="header-row"></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: displayedColumns"
                  class="data-row"
                  [class.row-overdue]="tareaEstaVencida(row)"
                ></tr>
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
      .back-link {
        display: inline-flex;
        align-items: center;
        margin-bottom: 8px;
        padding-left: 0;
      }
      .back-link mat-icon {
        margin-right: 4px;
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
        max-width: 520px;
        line-height: 1.45;
      }
      .lede .estado-pill {
        margin-left: 8px;
        vertical-align: middle;
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
      .tareas-table {
        width: 100%;
        background: #fff;
      }
      .header-row {
        background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
      }
      .tareas-table .mat-mdc-header-cell {
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
      .data-row.row-overdue {
        background-color: #fff7ed;
      }
      .data-row.row-overdue:hover {
        background-color: #ffedd5;
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
export class TareasComponent {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);

  displayedColumns = ['titulo', 'estado', 'prioridad', 'asignado', 'fechaLimite', 'acciones'];

  proyecto = this.store.selectSignal(selectTareasProyecto);
  items = this.store.selectSignal(selectTareas);
  total = this.store.selectSignal(selectTareasTotal);
  loading = this.store.selectSignal(selectTareasLoading);
  listError = this.store.selectSignal(selectTareasError);
  mutationError = this.store.selectSignal(selectTareasMutationError);
  rol = this.store.selectSignal(selectRol);

  proyectoId = 0;
  pageIndex = 0;
  pageSize = 10;

  readonly tareaEstaVencida = tareaEstaVencida;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(pm => {
      const id = Number(pm.get('proyectoId'));
      if (!Number.isFinite(id) || id < 1) return;
      this.proyectoId = id;
      this.pageIndex = 0;
      this.dispatchLoad();
    });
  }

  isAdmin(): boolean {
    return this.rol() === 'Administrador';
  }

  canMutate(): boolean {
    const r = this.rol();
    return r === 'Administrador' || r === 'Colaborador';
  }

  hayTransiciones(row: TareaDto): boolean {
    return estadosDestinoPermitidos(row.estadoId).length > 0;
  }

  onPage(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.dispatchLoad();
  }

  openCreate(): void {
    const ref = this.dialog.open(TareaFormDialogComponent, {
      data: { tarea: null },
      width: '520px'
    });
    ref.afterClosed().subscribe(payload => {
      if (!payload) return;
      this.store.dispatch(
        TareasActions.createTarea({
          proyectoId: this.proyectoId,
          payload,
          pagina: this.pageIndex + 1,
          tamanoPagina: this.pageSize
        })
      );
    });
  }

  openEdit(row: TareaDto): void {
    const ref = this.dialog.open(TareaFormDialogComponent, {
      data: { tarea: row },
      width: '520px'
    });
    ref.afterClosed().subscribe(payload => {
      if (!payload) return;
      this.store.dispatch(
        TareasActions.updateTarea({
          id: row.id,
          proyectoId: this.proyectoId,
          payload,
          pagina: this.pageIndex + 1,
          tamanoPagina: this.pageSize
        })
      );
    });
  }

  openCambiarEstado(row: TareaDto): void {
    const ref = this.dialog.open(TareaEstadoDialogComponent, {
      data: { tarea: row },
      width: '420px'
    });
    ref.afterClosed().subscribe(nuevoEstado => {
      if (nuevoEstado == null) return;
      const proyecto = this.proyecto();
      if (nuevoEstado === 3 && proyecto?.estadoId === 4) {
        const c = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Proyecto cancelado',
            message:
              'El proyecto está en estado Cancelada. Completar la tarea puede ser rechazado por el servidor. ¿Desea continuar?',
            confirmLabel: 'Continuar'
          },
          width: '420px'
        });
        c.afterClosed().subscribe(ok => {
          if (!ok) return;
          this.dispatchEstado(row.id, nuevoEstado);
        });
        return;
      }
      this.dispatchEstado(row.id, nuevoEstado);
    });
  }

  confirmDelete(row: TareaDto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar tarea',
        message: `¿Eliminar «${row.titulo}»? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar'
      },
      width: '400px'
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.store.dispatch(
        TareasActions.deleteTarea({
          id: row.id,
          proyectoId: this.proyectoId,
          pagina: this.pageIndex + 1,
          tamanoPagina: this.pageSize
        })
      );
    });
  }

  clearApiErrors(): void {
    this.store.dispatch(TareasActions.clearTareasApiErrors());
  }

  private dispatchEstado(tareaId: number, estadoId: number): void {
    this.store.dispatch(
      TareasActions.changeTareaEstado({
        id: tareaId,
        proyectoId: this.proyectoId,
        estadoId,
        pagina: this.pageIndex + 1,
        tamanoPagina: this.pageSize
      })
    );
  }

  private dispatchLoad(): void {
    if (this.proyectoId < 1) return;
    this.store.dispatch(
      TareasActions.loadTareas({
        proyectoId: this.proyectoId,
        pagina: this.pageIndex + 1,
        tamanoPagina: this.pageSize
      })
    );
  }
}
