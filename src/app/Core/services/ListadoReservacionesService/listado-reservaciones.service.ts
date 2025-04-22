import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ListadoReservacionesService {
  private http = inject(HttpClient);
  private urlBase = '';
  constructor() { }
  obtenerListadoReservaciones(): Observable<any[]>{
    return this.http.get<any[]>('');
  }
  eliminarReservacion(idReservacion: number):Observable<boolean>{
    return this.http.delete<boolean>(this.urlBase+`${idReservacion}`);
  }
  verReservacionEspecifica(idReservacion: number):Observable<boolean>{
    return this.http.get<boolean>(this.urlBase+`${idReservacion}`);
  }
}
