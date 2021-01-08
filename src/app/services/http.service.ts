import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Nota } from '../model/nota';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HTTP) { }

  obtenerNota(id: number): Promise<any> {
    return this.http.get(`https://ralba-restful.herokuapp.com/notas/${id}`, {}, { 'apikey': 'proyectoIonic' });
  }

  insertarNota(nota: Nota): Promise<any> {
    return this.http.post('https://ralba-restful.herokuapp.com/notas', {
      titulo: nota.titulo,
      texto: nota.texto,
      id_usuario: nota.id_usuario,
    }, { 'apikey': 'proyectoIonic' });
  }

  eliminarNota(id: number): Promise<any> {
    return this.http.delete(`https://ralba-restful.herokuapp.com/notas/${id}`, {}, { 'apikey': 'proyectoIonic' })
  }

  editarNota(id: number, nota: Nota): Promise<any> {
    return this.http.put(`https://ralba-restful.herokuapp.com/notas/${id}`, {
      titulo: nota.titulo,
      texto: nota.texto
    }, { 'apikey': 'proyectoIonic' })
  }

  getUserByID(id: number): Promise<any> {
    return this.http.get(`https://ralba-restful.herokuapp.com/usuarios/${id}`, {}, { 'apikey': 'proyectoIonic' });
  }

  getUserByEmail(email: string): Promise<any> {
    return this.http.get(`https://ralba-restful.herokuapp.com/usuarios/${email}`, {}, { 'apikey': 'proyectoIonic' })
  }

  getAllUsers(): Promise<any> {
    return this.http.get('https://ralba-restful.herokuapp.com/usuarios', {}, { 'apikey': 'proyectoIonic' })
  }

  insertarUsuario(user: Usuario): Promise<any> {
    return this.http.post('https://ralba-restful.herokuapp.com/usuarios', {
      email: user.email,
      nombre: user.name
    }, { 'apikey': 'proyectoIonic' });
  }

  eliminarUsuario(id: number): Promise<any> {
    return this.http.delete(`https://ralba-restful.herokuapp.com/usuarios/${id}`, {}, { 'apikey': 'proyectoIonic' })
  }

  editarUsuario(id: number, nombre: string): Promise<any> {
    return this.http.put(`https://ralba-restful.herokuapp.com/usuarios/${id}`, {
      nombre: nombre
    }, { 'apikey': 'proyectoIonic' });
  }

  obtenerAmigos(user: number): Promise<any> {
    return this.http.get(`https://ralba-restful.herokuapp.com/amigos/${user}`, {}, { 'apikey': 'proyectoIonic' })
  }

  añadirAmigo(u1: number, u2: number): Promise<any> {
    return this.http.post('https://ralba-restful.herokuapp.com/amigos', {
      usuario: u1,
      amigo: u2
    }, { 'apikey': 'proyectoIonic' });
  }

  eliminarAmigo(u1: number, u2: number): Promise<any> {
    return this.http.delete(`https://ralba-restful.herokuapp.com/amigos/${u1}/${u2}`, {}, { 'apikey': 'proyectoIonic' })
  }

  editarAmigo(u1: number, u2: number): Promise<any> {
    return this.http.put(`https://ralba-restful.herokuapp.com/amigos/${u1}/${u2}`, {
      amigo: u2
    }, { 'apikey': 'proyectoIonic' });
  }

}
