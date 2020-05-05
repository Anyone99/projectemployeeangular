// clase de empleador
import {Role} from './role';

export class Employee {
  idEmployee : Number;
  nombre : String;
  apellido : String;
  dni : String;
  password : String;
  dateContrato : Date;
  diaVacaciones : Number;
  role : Role;
  token? : string;

}