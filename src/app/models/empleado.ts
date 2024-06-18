export interface Empleado {
  id_usuario: string;
  nombres: string;
  apellidos: string;
  direccion: string;
  genero: string;
  telefono: string;
  email: string;
  password: string;
  id_rol: {
    id_rol: number;
    nombre: string;
  };
}
