import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OfertaDTO } from '../../models/OfertaDTO';

@Injectable({
  providedIn: 'root'
})
export class OfertaServiceService {

  constructor(private http: HttpClient) { }

  ofertaUrl = "https://www.hotel-jade-api.somee.com/api/Oferta";

  obtenerOfertasPaginadas(parametrosConsulta: any): Observable<any[]>{
    return this.http.post<any[]>(`${this.ofertaUrl}/paginadas`, parametrosConsulta, {headers: { auth: 'true' }});
  }

  desactivarOferta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.ofertaUrl}/${id}`, {headers: { auth: 'true' }});
  }

  modificarOferta(oferta: OfertaDTO): Observable<any> {
    return this.http.put<any>(`${this.ofertaUrl}`, oferta, {headers: { auth: 'true' }});
  }

  crearOferta(oferta: OfertaDTO): Observable<any> {
    return this.http.post<any>(`${this.ofertaUrl}`, oferta, {headers: { auth: 'true' }});
  }
  
}
