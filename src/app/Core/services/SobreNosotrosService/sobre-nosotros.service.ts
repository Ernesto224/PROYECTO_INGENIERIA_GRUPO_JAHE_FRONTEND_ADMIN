import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SobreNosotrosDTO } from '../../models/SobreNosotrosDTO';
import { GaleriaModificarDTO } from '../../models/GaleriaModificarDTO';
@Injectable({
  providedIn: 'root'
})
export class SobreNosotrosService {
  private urlBase: string = 'https://localhost:7169/api/SobreNosotros';
  private urlBaseActualizarImagen = 'https://localhost:7169/api/SobreNosotros/ActualizarImagen';
  private http = inject(HttpClient)
  constructor() { }

   enviarNuevaDescripcionSobreNosotros(sobreNosotrosDTO: SobreNosotrosDTO): Observable<SobreNosotrosDTO>{
    return this.http.put<SobreNosotrosDTO>(this.urlBase, sobreNosotrosDTO);
  }
  obtenerDatosSobreNosotros(): Observable<SobreNosotrosDTO>{
    return this.http.get<SobreNosotrosDTO>(this.urlBase);
  }
  actualizarImagenGaleria(imagenDTO: GaleriaModificarDTO): Observable<SobreNosotrosDTO>{
    return this.http.put<SobreNosotrosDTO>(this.urlBaseActualizarImagen, imagenDTO);
  }
}
