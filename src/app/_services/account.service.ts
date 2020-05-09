import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { environment } from "../../environment";
import { Employee, EmployeeResponse } from "../_models";

@Injectable({ providedIn: "root" })
export class AccountService {
  private employeeSubject: BehaviorSubject<Employee>;
  public employee: Observable<Employee>;

  constructor(private router: Router, private http: HttpClient) {
    this.employeeSubject = new BehaviorSubject<Employee>(
      JSON.parse(localStorage.getItem("employees"))
    );
    this.employee = this.employeeSubject.asObservable();
  }

  public get employeeValue(): Employee {
    return this.employeeSubject.value;
  }

  login(dni, password) {
    console.log("Account - service: Login " + dni + " " + password);
    return this.http
      .post<Employee>(`${environment.apiUrl}/employee/authenticate`, {
        dni,
        password
      })
      .pipe(
        map(employee => {
          // store employee details and jwt token in local storage to keep employee logged in between page refreshes
          localStorage.setItem("employees", JSON.stringify(employee));
          this.employeeSubject.next(employee);
          return employee;
        })
      );
  }

  logout() {
    // remove employee from local storage and set current employee to null
    localStorage.removeItem("employees");
    this.employeeSubject.next(null);
    this.router.navigate(["/account/login"]);
  }

  register(employee: Employee) {
    return this.http.post(`${environment.apiUrl}/employee/register`, employee);
  }

  getAll() {
    return this.http.get<Employee[]>(`${environment.apiUrl}/employee`);
  }

  getById(id: string) {
    return this.http.get<Employee>(`${environment.apiUrl}/employee/${id}`);
  }

  findByEmployee(employee: Employee[], nombre: string): any[] {
    if (!nombre) return employee;

    return employee.filter(emplo =>
      emplo.nombre.toUpperCase().includes(nombre.toUpperCase())
    );
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/employee/${id}`, params).pipe(
      map(x => {
        // update stored employee if the logged in employee updated their own record
        if (id == this.employeeValue.id) {
          // update local storage
          const employee = { ...this.employeeValue, ...params };
          localStorage.setItem("employees", JSON.stringify(employee));

          // publish updated employee to subscribers
          this.employeeSubject.next(employee);
        }
        return x;
      })
    );
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/employee/${id}`).pipe(
      map(x => {
        // auto logout if the logged in employee deleted their own record
        if (id == this.employeeValue.id) {
          this.logout();
        }
        return x;
      })
    );
  }
}
