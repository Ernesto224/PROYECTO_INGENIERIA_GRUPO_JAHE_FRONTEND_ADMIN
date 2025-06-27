import { Imagen } from './ImagenDTO';

export interface SobreNosotrosDTO {
  idSobreNosotros: number | null;
  descripcion: string;
  imagenes: Imagen[];
}