import { inject, Injectable } from '@angular/core';
import { ResultadoConsultaHabitacionDTO } from '../../models/ResultadoConsultaHabitacionDTO';
import { ResultadoConsultaHabitacionHoyDTO } from '../../models/ResultadoConsultaHabitacionHoyDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  private http = inject(HttpClient);
  private urlBase = "http://www.hotel-jade-api.somee.com/api/Habitacion";

  constructor() { }

  public consultaHabitacionesDisponibles = (parametrosConsulta: any) : Observable<ResultadoConsultaHabitacionDTO> => {
    return this.http.post<ResultadoConsultaHabitacionDTO>(`${this.urlBase}/ConsultaHabitaciones`, parametrosConsulta, {headers: { auth: 'true' }});
  }

  public consultarHabitacionesHoy = (parametrosConsulta: any): Observable<ResultadoConsultaHabitacionHoyDTO> => {
    return this.http.post<ResultadoConsultaHabitacionHoyDTO>(`${this.urlBase}/ConsultaHabitacionesHoy`, parametrosConsulta, {headers: { auth: 'true' }});
  }
}
