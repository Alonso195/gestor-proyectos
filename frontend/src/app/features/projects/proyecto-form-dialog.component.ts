import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ProyectoDto, ESTADOS_PROYECTO, SaveProyectoPayload } from './models/proyecto.models';

export interface ProyectoFormDialogData {
  proyecto: ProyectoDto | null;
}

@Component({
  selector: 'app-proyecto-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.proyecto ? 'Editar proyecto' : 'Nuevo proyecto' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content class="form-grid">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" />
          @if (form.controls.nombre.hasError('required')) {
            <mat-error>Requerido</mat-error>
          } @else if (form.controls.nombre.hasError('minlength')) {
            <mat-error>Mínimo 3 caracteres</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Descripción</mat-label>
          <textarea matInput rows="2" formControlName="descripcion"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Fecha inicio</mat-label>
          <input matInput type="date" formControlName="fechaInicio" />
          <mat-error>Requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Fecha fin</mat-label>
          <input matInput type="date" formControlName="fechaFin" />
          <mat-error>Requerido</mat-error>
        </mat-form-field>

        @if (form.hasError('fechas')) {
          <p class="error-text full">La fecha de fin debe ser mayor o igual a la fecha de inicio.</p>
        }

        <mat-form-field appearance="outline" class="full">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="estadoId">
            @for (e of estados; track e.id) {
              <mat-option [value]="e.id">{{ e.nombre }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
          Guardar
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        min-width: 420px;
        padding-top: 8px;
      }
      .full {
        grid-column: 1 / -1;
      }
      .error-text {
        color: var(--mat-form-field-error-text-color, #b3261e);
        margin: 0;
        font-size: 12px;
      }
    `
  ]
})
export class ProyectoFormDialogComponent {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<ProyectoFormDialogComponent, SaveProyectoPayload | undefined>);

  data: ProyectoFormDialogData;

  estados = ESTADOS_PROYECTO;

  form = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      estadoId: [1, Validators.required]
    },
    { validators: [fechasOrdenadasValidator] }
  );

  constructor(@Inject(MAT_DIALOG_DATA) dialogData: ProyectoFormDialogData) {
    this.data = dialogData;
    const p = dialogData.proyecto;
    if (p) {
      this.form.patchValue({
        nombre: p.nombre,
        descripcion: p.descripcion ?? '',
        fechaInicio: p.fechaInicio.slice(0, 10),
        fechaFin: p.fechaFin.slice(0, 10),
        estadoId: p.estadoId
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const payload: SaveProyectoPayload = {
      nombre: v.nombre.trim(),
      descripcion: v.descripcion?.trim() || null,
      fechaInicio: v.fechaInicio,
      fechaFin: v.fechaFin,
      estadoId: v.estadoId
    };
    this.ref.close(payload);
  }
}

const fechasOrdenadasValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const ini = group.get('fechaInicio')?.value as string | undefined;
  const fin = group.get('fechaFin')?.value as string | undefined;
  if (!ini || !fin) return null;
  const d0 = new Date(ini + 'T00:00:00');
  const d1 = new Date(fin + 'T00:00:00');
  return d1 >= d0 ? null : { fechas: true };
};
