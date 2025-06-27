import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ReservacionDTO } from '../../models/ReservacionDTO';
import { RespuestaConsultaReservaDTO } from '../../models/RespuestaConsultaReservaDTO ';

@Injectable({
  providedIn: 'root',
})
export class ListadoReservacionesService {
  private http = inject(HttpClient);
  private urlBase = 'http://www.hotel-jade-api.somee.com/api/Reserva';

  constructor() {}

  public obtenerListadoReservaciones = (
    parametrosConsulta: any
  ): Observable<RespuestaConsultaReservaDTO> => {
    return this.http.post<RespuestaConsultaReservaDTO>(
      `${this.urlBase}/ListaReservaciones`,
      parametrosConsulta,
      {
        headers: { auth: 'true' },
      }
    );
  };

  public eliminarReservacion = (idReservacion: string): Observable<boolean> => {
    return this.http.delete<boolean>(`${this.urlBase}/${idReservacion}`, {
      headers: { auth: 'true' },
    });
  };

  public verReservacionEspecifica = (
    idReservacion: string
  ): Observable<ReservacionDTO> => {
    return this.http.get<ReservacionDTO>(
      `${this.urlBase}/DetalleReservacion/${idReservacion}`,
      { headers: { auth: 'true' } }
    );
  };
}
