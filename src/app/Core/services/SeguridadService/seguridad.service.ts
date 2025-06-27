import { inject, Injectable, signal } from '@angular/core';
import { TokenDeRespuestaDTO } from '../../models/TokenDeRespuestaDTO';
import { StorageService } from '../StorageService/storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {

  private storage = inject(StorageService);
  private router = inject(Router);
  private keyStorageIsAuth = "isAuthenticated";
  private keyStorageTokens = "tokens";
  public isAuthenticated = signal(false);

  constructor() { }

  public getToken = (): TokenDeRespuestaDTO | null => { 
    return this.storage.getItem(this.keyStorageTokens);
  }

  public setToken = (token: TokenDeRespuestaDTO): void => {
    this.storage.setItem(this.keyStorageTokens, token);
  }

  public autenticar = (): void => {
    this.storage.setItem(this.keyStorageIsAuth, true);
    this.isAuthenticated.set(true);
  }

  public existeAutenticacion = (): boolean => {
    return this.storage.getItem(this.keyStorageIsAuth) === true;
  }

  public logout = (): void => {
    this.storage.clear();
    this.isAuthenticated.set(false);
    this.router.navigate(['login']);
  }

}
