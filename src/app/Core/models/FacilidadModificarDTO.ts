export interface FacilidadModificarDTO {
    idFacilidad: number;
    descripcion: string;
    imagen: string | null;        // base64
    nombreArchivo: string;        // nombre original del archivo  
}