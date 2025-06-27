import { Imagen } from './ImagenDTO';

export interface PublicidadDTO {
  idPublicidad: number;
  enlacePublicidad: string;
  activo: boolean;
  imagen: Imagen;
}