import { Imagen } from './ImagenDTO';

export interface SobreNosotrosDTO {
  idSobreNosotros?: number;
  descripcion: string;
  imagenes: Imagen[];
}