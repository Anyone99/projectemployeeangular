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

let employee = JSON.parse(localStorage.getItem("employee")) || [];

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

    function handleRoute() {
      switch (true) {
        case url.endsWith("/employee/authenticate") && method === "POST":
          return authenticate();
        case url.endsWith("/employee/register") && method === "POST":
          return register();
        case url.endsWith("/employee") && method === "GET":
          return getEmployee();
        case url.match(/\/employee\/\d+$/) && method === "GET":
          return getEmployeeById();
        case url.match(/\/employee\/\d+$/) && method === "PUT":
          return updateEmployee();
        case url.match(/\/employee\/\d+$/) && method === "DELETE":
          return deleteEmployee();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const { email, password } = body;
      const emp = employee.find(
        x => x.email === email && x.password === password
      );
      if (!emp) return error("Email or password is incorrect");
      return ok({
        idEmployee: emp.idEmployee,
        email: emp.email,
        nombre: emp.nombre,
        apellido: emp.apellido,
        dni: emp.dni
      });
    }

    function register() {
      const user = body;

      if (employee.find(x => x.email === user.email)) {
        return error('Email  :  "' + user.email + '" is already taken');
      }

      user.id = employee.length
        ? Math.max(...employee.map(x => x.idEmployee)) + 1
        : 1;
      employee.push(user);
      localStorage.setItem("employee", JSON.stringify(employee));
      return ok();
    }

    function getEmployee() {
      if (!isLoggedIn()) return unauthorized();
      return ok(employee);
    }

    function getEmployeeById() {
      if (!isLoggedIn()) return unauthorized();
      const emp = employee.find(x => x.idEmployee === idFromUrl());
      return ok(emp);
    }

    function updateEmployee() {
      if (!isLoggedIn()) return unauthorized();

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

      employee = employee.filter(x => x.idEmployee !== idFromUrl());
      localStorage.setItem("employee", JSON.stringify(employee));
      return ok();
    }

    //----- helper functions ----

    //comprobar si el usuario está autorizado.
    function unauthorized() {
      return throwError({
        statys: 401,
        error: { message: "El empleado no está autorizado" }
      });
    }

    function idFromUrl() {
      const urlParts = url.split("/");
    }

    //si está logeado
    function isLoggedIn() {
      return headers.get("Autorizartion") === "Bearer fake-jwt-token";
    }

    //si está ok .
    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }));
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
