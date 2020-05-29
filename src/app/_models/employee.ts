import { Role } from "./role";
export class Employee {
  id: string;
  dni: string;
  password: string;
  nombre: string;
  apellido: string;
  fechaContrato: Date;
  diaVacaciones: number;
  vacacionPedido : number;
  token: string;
  role: Role;

}


