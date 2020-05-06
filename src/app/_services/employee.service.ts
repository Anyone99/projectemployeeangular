import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

import { environment } from "../../environment";
import { Employee } from "../_models";

@Injectable({ providedIn: "root" })
export class EmployeeService {
  private employeeSubject: BehaviorSubject<Employee>;
  public employee: Observable<Employee>;

  constructor(private router: Router, private http: HttpClient) {
    this.employeeSubject = new BehaviorSubject<Employee>(
      JSON.parse(localStorage.getItem("employee"))
    );
    this.employee = this.employeeSubject.asObservable();
  }

  public get employeeValue(): Employee {
    return this.employeeSubject.value;
  }

  login(dni: String, password: String) {
    return this.http
      .post<Employee>(`${environment.apiUrl}/employees/authenticate`, {
        dni,
        password
      })
      .pipe(
        map(employee => {
          if (employee && employee.token) {
            //guardar los datos de usuario y jwt token en un local storage to keep user logged in between page refreshes
            localStorage.setItem("employee", JSON.stringify(employee));
            this.employeeSubject.next(employee);
          }
          console.log("Employee Service - Login " + employee);
          
          return employee;
        })
      );
  }

  //eliminar el usuario desde local storage y modificar el usuario que no está logeado
  logout() {
    localStorage.removeItem("employee");
    this.employeeSubject.next(null);
    this.router.navigate(["/login"]);
  }

  register(employee: Employee) {
    return this.http.post(`${environment.apiUrl}/employees/register`, employee);
  }

  getAll() {
    return this.http.get<Employee[]>(`${environment.apiUrl}/employees`);
  }

  getById(idEmployee: Number) {
    return this.http.get<Employee>(
      `${environment.apiUrl}/employees/${idEmployee}`
    );
  }

  update(idEmployee, params) {
    return this.http
      .put(`${environment.apiUrl}/employees/${idEmployee}`, params)
      .pipe(
        map(x => {
          //modificar el usuario guardado si está logueado en el usuario.
          if (idEmployee == this.employeeValue.idEmployee) {
            //modificar
            const employee = { ...this.employeeValue, ...params };
            localStorage.setItem("employee", JSON.stringify(employee));

            this.employeeSubject.next(employee);
          }
          return x;
        })
      );
  }

  delete(idEmployee: Number) {
    return this.http
      .delete(`${environment.apiUrl}/employees/${idEmployee}`)
      .pipe(
        map(x => {
          if (idEmployee === this.employeeValue.idEmployee) {
            console.log("Delete : " + idEmployee);
            this.logout();
          }
          return x;
        })
      );
  }
}
