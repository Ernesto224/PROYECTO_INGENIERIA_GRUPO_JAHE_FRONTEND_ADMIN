import { inject, Injectable } from '@angular/core';
import { ResultadoConsultaHabitacionDTO } from '../../models/ResultadoConsultaHabitacionDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  private http = inject(HttpClient);
  private urlBase = "https://localhost:7169/api/Habitacion/ConsultaHabitaciones";

  constructor() { }

  public consultaHabitacionesDisponibles = (parametrosConsulta: any) : Observable<ResultadoConsultaHabitacionDTO> => {
    return this.http.post<ResultadoConsultaHabitacionDTO>(this.urlBase, parametrosConsulta, {headers: { auth: 'true' }});
  }
}
