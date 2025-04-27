import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage:any; 

  constructor() { 
    this.storage = localStorage;
  }

  public setItem = (key: string, value: any): void => {
    try {
      const serialized = JSON.stringify(value);
      this.storage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error guardando en storage [${key}]:`, error);
    }
  }

  public getItem = (key: string): any => {
    try {
      const item = this.storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error leyendo de storage [${key}]:`, error);
      return null;
    }
  }

  public removeItem = (key: string): void => {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`Error eliminando de storage [${key}]:`, error);
    }
  }

  public clear = (): void => {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Error limpiando storage:', error);
    }
  }

  public exists = (key: string): boolean => {
    return this.storage.getItem(key) !== null;
  }

}
