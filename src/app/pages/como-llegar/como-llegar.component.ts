import { Component, inject,OnInit, effect, signal, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComoLlegarService } from '../../Core/services/ComoLlegarService/como-llegar.service'; 
import { DireccionDTO } from '../../Core/models/DireccionDTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-como-llegar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './como-llegar.component.html',
  styleUrl: './como-llegar.component.css'
})
export class ComoLlegarComponent {
  private service = inject(ComoLlegarService);
  readonly direccion = signal<DireccionDTO>({
    idDireccion: -1,
    descripcion: ''
  });
  readonly confirmacion = signal<boolean>(false);
  readonly descripcionControl = new FormControl('');
  ngOnInit(){
    this.obtenerInformacion();
  }

  obtenerInformacion(): void{
    this.service.obtenerDatosComoLlegar().subscribe({
     next: (data)=>{
      this.direccion.set(data);
      this.descripcionControl.setValue(data.descripcion);
     },
     error: (Error)=>{
      console.error("Hubo un error", Error);
     },
     complete: ()=>{
      console.log("Se completó la operación");
     }
    })
  }
  actualizarInformacion(): void{
    const descripcionActualizada = this.descripcionControl.value??'';
    const DireccionActualizada = {...this.direccion(), descripcion: descripcionActualizada} 
    this.service.enviarNuevoTextoComoLlegar(DireccionActualizada).subscribe({
      next: (data)=>{
        this.direccion.set(data);
      },
      error: (Error)=>{
        console.error("Hubo un error al actualizar", Error);
      },
      complete: ()=>{
        console.log("Actualizacion completada");
      }
    });
  }
}
