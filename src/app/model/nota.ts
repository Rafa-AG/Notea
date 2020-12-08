import { StringMap } from '@angular/compiler/src/compiler_facade_interface';

export interface Nota{
    id?:any,
    titulo: string,
    texto: string,
    fecha?:any,
    coordenadas?:any,
    imagen?:any
    favorito?:boolean
}