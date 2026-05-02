import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  PRIORIDADES_TAREA,
  SaveTareaPayload,
  TareaDto,
  USUARIOS_ASIGNABLES
} from './models/tarea.models';

export interface TareaFormDialogData {
  tarea: TareaDto | null;
}

@Component({
  selector: 'app-tarea-form-dialog',
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
    <h2 mat-dialog-title>{{ data.tarea ? 'Editar tarea' : 'Nueva tarea' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content class="form-grid">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Título</mat-label>
          <input matInput formControlName="titulo" />
          @if (form.controls.titulo.hasError('required')) {
            <mat-error>Requerido</mat-error>
          } @else if (form.controls.titulo.hasError('minlength')) {
            <mat-error>Mínimo 3 caracteres</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Descripción</mat-label>
          <textarea matInput rows="2" formControlName="descripcion"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Prioridad</mat-label>
          <mat-select formControlName="prioridadId">
            @for (p of prioridades; track p.id) {
              <mat-option [value]="p.id">{{ p.nombre }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Fecha límite</mat-label>
          <input matInput type="date" formControlName="fechaLimite" />
          <mat-error>Requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Asignado a</mat-label>
          <mat-select formControlName="usuarioAsignadoId">
            <mat-option [value]="null">Sin asignar</mat-option>
            @for (u of usuarios; track u.id) {
              <mat-option [value]="u.id">{{ u.nombre }}</mat-option>
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
    `
  ]
})
export class TareaFormDialogComponent {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<TareaFormDialogComponent, SaveTareaPayload | undefined>);

  data: TareaFormDialogData;

  prioridades = PRIORIDADES_TAREA;
  usuarios = USUARIOS_ASIGNABLES;

  form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    prioridadId: [2, Validators.required],
    fechaLimite: ['', Validators.required],
    usuarioAsignadoId: [null as number | null]
  });

  constructor(@Inject(MAT_DIALOG_DATA) dialogData: TareaFormDialogData) {
    this.data = dialogData;
    const t = dialogData.tarea;
    if (t) {
      this.form.patchValue({
        titulo: t.titulo,
        descripcion: t.descripcion ?? '',
        prioridadId: t.prioridadId,
        fechaLimite: t.fechaLimite.slice(0, 10),
        usuarioAsignadoId: t.usuarioAsignadoId
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const payload: SaveTareaPayload = {
      titulo: (v.titulo ?? '').trim(),
      descripcion: v.descripcion?.trim() || null,
      prioridadId: v.prioridadId ?? 2,
      usuarioAsignadoId: v.usuarioAsignadoId,
      fechaLimite: v.fechaLimite ?? ''
    };
    this.ref.close(payload);
  }
}
