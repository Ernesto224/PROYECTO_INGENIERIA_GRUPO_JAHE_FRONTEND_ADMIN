import { inject, Injectable } from '@angular/core';
import { PublicidadDTO } from '../../models/PublicidadDTO';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PublicidadCrearDTO } from '../../models/PublicidadCrearDTO';


@Injectable({
  providedIn: 'root'
})
export class PublicidadService {

  private http = inject(HttpClient);
  private urlBase = "https://localhost:7169/api/Publicidad";
 
  constructor() { }
 
  public obtenerPublicidades = () : Observable<PublicidadDTO[]> => {
    return this.http.get<PublicidadDTO[]>(this.urlBase);
  }

  public eliminarPublicidad = (id: number): Observable<any> => {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<any>(url);
  }
  
  public crearPublicidad = (publicidad: PublicidadCrearDTO): Observable<any> => {
    return this.http.post<any>(this.urlBase, publicidad);
  }

}