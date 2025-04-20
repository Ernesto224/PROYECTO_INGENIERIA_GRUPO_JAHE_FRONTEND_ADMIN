import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public setItem = <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error guardando en localStorage [${key}]:`, error);
    }
  }

  public getItem = <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) as T : null;
    } catch (error) {
      console.error(`Error leyendo de localStorage [${key}]:`, error);
      return null;
    }
  }

  public removeItem = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error eliminando de localStorage [${key}]:`, error);
    }
  }

  public clear = (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  }

  public exists = (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  }

}
