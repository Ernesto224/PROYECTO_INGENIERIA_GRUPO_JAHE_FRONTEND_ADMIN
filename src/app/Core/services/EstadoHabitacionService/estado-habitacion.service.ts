import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EstadoHabitacionDTO } from '../../models/EstadoHabitacionDTO';
import { Observable } from 'rxjs';
import { EstadoHabitacionModificarDTO } from '../../models/EstadoHabitacionModificarDTO';

@Injectable({
  providedIn: 'root'
})
export class EstadoHabitacionService {

  
  private http = inject(HttpClient);
  private urlBase = "https://localhost:7169/api/EstadoHabitacion";
  
  constructor() { }
  
  public obtenerHabitaciones = () : Observable<EstadoHabitacionDTO[]> => {
    return this.http.get<EstadoHabitacionDTO[]>(this.urlBase);
  }
  

  public actualizarEstadoHabitacion(dto: EstadoHabitacionModificarDTO): Observable<{ exitoso: boolean, mensaje: string }> {
    return this.http.put<{ exitoso: boolean, mensaje: string }>(this.urlBase, dto);
  }
  
  
}
