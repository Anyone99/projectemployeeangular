import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { delay, mergeMap, materialize, dematerialize } from "rxjs/operators";
import { Employee, Role } from "../_models";

let employee = JSON.parse(localStorage.getItem("employee")) || [];
console.log("Employee " + employee);
const admin: Employee[] = [
  {
    idEmployee: 1,
    nombre: "admin",
    apellido: "admin",
    dni: "11111111F",
    password: "root",
    dateContrato: new Date("01-05-2020"),
    diaVacaciones: 0,
    role: Role.Admin
  }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());

    if (Object.keys(employee).length === 0) {
      employee.push(admin);
      localStorage.setItem("employee", JSON.stringify(employee));
      ok(admin);
      console.log("Add Admin : " + employee);
    }

    function handleRoute() {
      switch (true) {
        case url.endsWith("/employees/authenticate") && method === "POST":
          return authenticate();
        case url.endsWith("/employees/register") && method === "POST":
          return register();
        case url.endsWith("/employees") && method === "GET":
          return getEmployee();
        case url.match(/\/employees\/\d+$/) && method === "GET":
          return getEmployeeById();
        case url.match(/\/employees\/\d+$/) && method === "PUT":
          return updateEmployee();
        case url.match(/\/employees\/\d+$/) && method === "DELETE":
          return deleteEmployee();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const { dni, password } = body;
      const emp = employee.find(x => x.dni === dni && x.password === password);
      console.log("authenticate : " + dni + " " + password + " : " + emp) ;

      if (!emp) return error("dni or password is incorrect");

      return ok({
        idEmployee: emp.idEmployee,
        dni: emp.dni,
        nombre: emp.nombre,
        apellido: emp.apellido,
        role: emp.role,
        token: `fake-jwt-token.${emp.idEmployee}`
      });
    }

    function register() {
      const user = body;

      if (employee.find(x => x.dni === user.dni)) {
        return error('dni  :  "' + user.dni + '" is already taken');
      }

      user.idEmployee = employee.length
        ? Math.max(...employee.map(x => x.idEmployee)) + 1
        : 1;
      user.role = Role.Employee;
      employee.push(user);
      localStorage.setItem("employee", JSON.stringify(employee));
      return ok();
    }

    function getEmployee() {
      if (!isLoggedIn()) return unauthorized();
      if (!isAdmin()) return unauthorized();

      return ok(employee);
    }

    function getEmployeeById() {
      if (!isLoggedIn()) return unauthorized();
      if (!isAdmin() && currentUser().idEmployee !== idFromUrl())
        return unauthorized();

      const emp = employee.find(x => x.idEmployee === idFromUrl());
      return ok(emp);
    }

    function updateEmployee() {
      if (!isLoggedIn()) return unauthorized();
      if (!isAdmin() && currentUser().idEmployee !== idFromUrl())
        return unauthorized();

      let params = body;
      let emp = employee.find(x => x.idEmployee === idFromUrl());
      // only update password if entered
      if (!params.password) {
        delete params.password;
      }

      // update and save user
      Object.assign(emp, params);
      localStorage.setItem("employee", JSON.stringify(emp));
    }

    function deleteEmployee() {
      if (!isLoggedIn()) return unauthorized();
      if (!isAdmin() && currentUser().id !== idFromUrl()) return unauthorized();

      employee = employee.filter(x => x.idEmployee !== idFromUrl());
      localStorage.setItem("employee", JSON.stringify(employee));
      return ok();
    }

    //----- helper functions ----

    function idFromUrl() {
      const urlParts = url.split("/");
      return parseInt(urlParts[urlParts.length - 1]);
    }

    function isAdmin() {
      return isLoggedIn() && currentUser().rol === Role.Admin;
    }

    function currentUser() {
      if (!isLoggedIn()) return;
      const id = parseInt(headers.get("Authorization").split(".")[1]);
      return employee.find(x => x.idEmployee === id);
    }

    //si está logeado
    function isLoggedIn() {
      const authHeader = headers.get("Authorization") || "";
      return authHeader.startsWith("Bearer fake-jwt-token");
    }

    //si está ok .
    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }));
    }

    //comprobar si el usuario está autorizado.
    function unauthorized() {
      return throwError({
        statys: 401,
        error: { message: "El empleado no está autorizado" }
      });
    }

    //mensaje de error
    function error(message) {
      return throwError({ error: { message } });
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
