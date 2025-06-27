import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemporadaServiceService } from '../../Core/services/TemporadaService/temporada-service.service';
import { temporadaDTO } from '../../Core/models/Temporada';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomMatPaginatorIntlComponent } from '../../Core/components/custom-mat-paginator-intl/custom-mat-paginator-intl/custom-mat-paginator-intl.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-temporada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
      MatButtonModule, MatIconModule, MatSlideToggleModule, MatTableModule, MatPaginatorModule, MatDatepickerModule],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlComponent }, provideNativeDateAdapter()],
  templateUrl: './temporada.component.html',
  styleUrl: './temporada.component.css'
})
export class ModificarTemporadaComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private temporadaService: TemporadaServiceService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      idTemporada: [null],
      porcentaje: [null, [Validators.required, Validators.min(0)]],
      fechaInicio: [null, Validators.required],
      fechaFinal: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDatosTemporada();
  }

  cargarDatosTemporada(): void {
    this.temporadaService.obtenerTemporadaAlta().subscribe({
      next: (temporada) => {
        this.form.patchValue({
          idTemporada: temporada.idTemporada,
          porcentaje: temporada.porcentaje,
          fechaInicio: new Date(temporada.fechaInicio),
          fechaFinal: new Date(temporada.fechaFinal)
        });
      },
      error: () => this.mostrarError('Error cargando temporada')
    });
  }

  guardar(): void {
    if (this.form.valid) {
      const datos: temporadaDTO = {
        idTemporada: this.form.value.idTemporada,
        porcentaje: this.form.value.porcentaje,
        fechaInicio: this.form.value.fechaInicio,
        fechaFinal: this.form.value.fechaFinal
      };

      this.temporadaService.modificarOferta(datos).subscribe({
        next: () => this.mostrarExito('Temporada actualizada correctamente'),
        error: () => this.mostrarError('Error actualizando temporada')
      });
    }
  }

  private mostrarExito(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['exito-snackbar']
    });
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
