import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { estadosDestinoPermitidos, TareaDto } from './models/tarea.models';

export interface TareaEstadoDialogData {
  tarea: TareaDto;
}

@Component({
  selector: 'app-tarea-estado-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Cambiar estado</h2>
    <mat-dialog-content class="content">
      <p class="task-title">{{ data.tarea.titulo }}</p>
      <p class="current">Estado actual: <strong>{{ data.tarea.estadoNombre }}</strong></p>

      @if (opciones.length === 0) {
        <p class="hint">No hay transiciones disponibles para este estado.</p>
      } @else {
        <form [formGroup]="form" id="estado-form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Nuevo estado</mat-label>
            <mat-select formControlName="estadoId">
              @for (e of opciones; track e.id) {
                <mat-option [value]="e.id">{{ e.nombre }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </form>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      @if (opciones.length === 0) {
        <button mat-button mat-dialog-close type="button">Cerrar</button>
      } @else {
        <button mat-button type="button" mat-dialog-close>Cancelar</button>
        <button
          mat-flat-button
          color="primary"
          type="submit"
          form="estado-form"
          [disabled]="form.invalid"
        >
          Guardar
        </button>
      }
    </mat-dialog-actions>
  `,
  styles: [
    `
      .content {
        min-width: 320px;
        padding-top: 8px;
      }
      .task-title {
        margin: 0 0 8px;
        font-weight: 500;
        color: #1e293b;
      }
      .current {
        margin: 0 0 16px;
        font-size: 0.9rem;
        color: #475569;
      }
      .hint {
        margin: 0;
        color: #64748b;
        font-size: 0.9rem;
      }
      .full {
        width: 100%;
      }
    `
  ]
})
export class TareaEstadoDialogComponent {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<TareaEstadoDialogComponent, number | undefined>);

  data: TareaEstadoDialogData;

  opciones = estadosDestinoPermitidos(0);

  form = this.fb.nonNullable.group({
    estadoId: [1, Validators.required]
  });

  constructor(@Inject(MAT_DIALOG_DATA) dialogData: TareaEstadoDialogData) {
    this.data = dialogData;
    this.opciones = estadosDestinoPermitidos(dialogData.tarea.estadoId);
    const first = this.opciones[0]?.id;
    if (first !== undefined) {
      this.form.patchValue({ estadoId: first });
    }
  }

  submit(): void {
    if (this.form.invalid || this.opciones.length === 0) return;
    this.ref.close(this.form.getRawValue().estadoId);
  }
}
