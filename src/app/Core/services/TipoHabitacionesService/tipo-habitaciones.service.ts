import { inject, Injectable } from '@angular/core';
import { TipoDeHabitacionDTO } from '../../models/TipoDeHabitacionDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoHabitacionesService {

  private http = inject(HttpClient);
  private urlBase = "https://www.hotel-jade-api.somee.com/api/Tarifas";

  constructor() { }

  public obtenerTipoDeHabitaciones = () : Observable<TipoDeHabitacionDTO[]> => {
    return this.http.get<TipoDeHabitacionDTO[]>(this.urlBase);
  }

  public actualizarTipoHabitacion(tipoHabitacion: any) {
    return this.http.put('https://www.hotel-jade-api.somee.com/api/Tarifas', tipoHabitacion, {headers: { auth: 'true' }});
  }

}
