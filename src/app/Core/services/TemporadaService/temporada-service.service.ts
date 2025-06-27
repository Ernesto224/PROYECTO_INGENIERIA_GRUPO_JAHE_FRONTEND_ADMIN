import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { temporadaDTO } from '../../models/Temporada';

@Injectable({
  providedIn: 'root'
})
export class TemporadaServiceService {

  constructor(private http: HttpClient) { }
 
   temporadaUrl = "https://localhost:7169/api/Temporada";

     modificarOferta(temporadaDTO: temporadaDTO): Observable<any> {
       return this.http.put<any>(`${this.temporadaUrl}/ModificarTemporadaAlta`, temporadaDTO, {headers: { auth: 'true' }});
     }

     obtenerTemporadaAlta(): Observable<temporadaDTO> {
       return this.http.get<temporadaDTO>(`${this.temporadaUrl}/ObtenerTemporadaAlta`, {headers: { auth: 'true' }});
     }
}
