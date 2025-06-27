import { inject, Injectable } from '@angular/core';
import { FacilidadDTO } from '../../models/FacilidadDTO';
import { FacilidadModificarDTO } from '../../models/FacilidadModificarDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FacilidadesService {

  private http = inject(HttpClient);
  private urlBase = "http://www.hotel-jade-api.somee.com/api/Facilidad";

  constructor() { }

  public obtenerFacilidades = () : Observable<FacilidadDTO[]> => {
    return this.http.get<FacilidadDTO[]>(this.urlBase);
  }

  public actualizarFacilidad(facilidad: FacilidadModificarDTO) {
    return this.http.put(this.urlBase, facilidad);
  }

}
