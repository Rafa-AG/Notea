/**
 * Model interface Nota
 */
export interface Nota{
    id?:any,
    titulo: string,
    texto: string,
    fecha?:any,
    coordenadas?:any,
    imagen?:any
    favorito?:boolean,
    id_usuario?:number
}