import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilidadDTO } from '../../Core/models/FacilidadDTO';
import { FacilidadModificarDTO } from '../../Core/models/FacilidadModificarDTO';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FacilidadesService } from '../../Core/services/FacilidadesService/facilidades.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facilidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,MatButtonModule, MatIcon],
  templateUrl: './facilidades.component.html',
  styleUrl: './facilidades.component.css'
})
export class FacilidadesComponent implements OnInit {

  private facilidadesService = inject(FacilidadesService);
  public listaFacilidades: FacilidadDTO[] = [];

  private fb = inject(FormBuilder);
  form: FormGroup;
  imagenBase64: string | null = null;
  nombreArchivo: string = '';
  imagenUrl: string = '';

  constructor() {
    this.form = this.fb.group({
      idFacilidad: [null, Validators.required],
      descripcion: ['', Validators.required],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.obtenerFacilidades();
  }

  private obtenerFacilidades() : void {
    this.facilidadesService.obtenerFacilidades().subscribe(response => {
      this.listaFacilidades = response;
    });
  }

  public onSelectFacilidad(id: number): void {}

  public onFileSelected(event: any): void {}
  
  public actualizar() : void {}

  public cancelar() : void {}

}
