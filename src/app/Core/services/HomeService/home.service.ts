import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HomeDTO } from '../../models/HomeDTO';
import { HomeModificarDTO } from '../../models/HomeModificarDTO';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private http = inject(HttpClient);
    private urlBase = "https://localhost:7169/api/Home";
  
    constructor() { }
  
    public obtenerDatosHome = () : Observable<HomeDTO> => {
      return this.http.get<HomeDTO>(this.urlBase);
    }
  
    public actualizarHome(home: HomeModificarDTO): Observable<any> {
      return this.http.put(this.urlBase, home);
    }

}
