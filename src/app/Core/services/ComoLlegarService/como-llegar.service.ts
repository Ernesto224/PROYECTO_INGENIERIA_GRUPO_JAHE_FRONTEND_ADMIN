import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DireccionDTO } from '../../models/DireccionDTO';
@Injectable({
  providedIn: 'root'
})
export class ComoLlegarService {
  private http = inject(HttpClient);
  private urlBase = 'https://localhost:7169/api/Direccion';
  constructor() { }
  enviarNuevoTextoComoLlegar(comoLlegarDTO: DireccionDTO): Observable<DireccionDTO>{
    return this.http.put<DireccionDTO>(this.urlBase, comoLlegarDTO);
  }
  obtenerDatosComoLlegar(): Observable<DireccionDTO>{
    return this.http.get<DireccionDTO>(this.urlBase);
  }
}
