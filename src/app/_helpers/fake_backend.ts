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

// array in local storage para registrar el usuario
let employees = JSON.parse(localStorage.getItem("employees")) || [];

//guardar el administrador por defecto.
const admin = {
  id: "1",
  nombre: "admin",
  apellido: "admin",
  dni: "00000000F",
  password: "admin222",
  fechaContrato: new Date(Date.now()),
  diaVacaciones: 0,
  role: Role.Admin,
  take: "fake-jwt-token"
};

console.log("fake init : " + JSON.stringify(employees));

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // envolver en observable retrasado para simular la llamada api del servidor
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());

    //si en localstorage no existe el administrador, se guardará.
    function handleRoute() {
      if (employees.find(x => x.dni === "00000000F")) {
      } else {
        employees.push(admin);
        localStorage.setItem("employees", JSON.stringify(employees));
        console.log("Admin : " + admin);
      }

      //acutalizar los datos.
      actualizarDatos();

      switch (true) {
        case url.endsWith("/employee/authenticate") && method === "POST":
          return authenticate();
        case url.endsWith("/employee/register") && method === "POST":
          return register();
        case url.endsWith("/employee") && method === "GET":
          return getUsers();
        case url.match(/\/employee\/\d+$/) && method === "GET":
          return getUserById();
        case url.match(/\/employee\/\d+$/) && method === "PUT":
          return updateUser();
        case url.match(/\/employee\/\d+$/) && method === "DELETE":
          return deleteUser();
        default:
          // pasar a través de cualquier solicitud que no se maneje por encima
          return next.handle(request);
      }
    }

    // función de route
    function authenticate() {
      const { dni, password } = body;

      const employee = employees.find(
        x => x.dni === dni && x.password === password
      );
      if (!employee) return error("dni or password is incorrect");

      return ok({
        id: employee.id,
        dni: employee.dni,
        nombre: employee.nombre,
        apellido: employee.apellido,
        role: employee.role,
        token: "fake-jwt-token"
      });
    }

    function register() {
      const employee = body;

      if (employees.find(x => x.dni === employee.dni)) {
        return error('dni "' + employee.dni + '" is already taken');
      }

      employee.id = employees.length
        ? Math.max(...employees.map(x => x.id)) + 1
        : 1;

      employee.role = Role.Employee;

      employee.diaVacaciones = Math.floor(employee.diaVacaciones);

      employee.dni = employee.dni.toUpperCase();

      console.log("Registrar : " + employee.diaVacaciones);

      employees.push(employee);

      localStorage.setItem("employees", JSON.stringify(employees));
      return ok();
    }

    function getUsers() {
      if (!isLoggedIn() && !isAdmin()) return unauthorized();
      return ok(employees);
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();

      const user = employees.find(x => x.id === idFromUrl());
      console.log("get User By ID");
      console.log(user);
      return ok(user);
    }

    function updateUser() {
      if (!isLoggedIn() && !isAdmin()) return unauthorized();

      let params = body;

      let user = employees.find(x => x.id === idFromUrl());

      user.dni = user.dni.toUpperCase();

      //solo modificar la contraseña si introduce
      if (!params.password) {
        delete params.password;
      }

      // guardar y modificar el usuario
      Object.assign(user, params);
      localStorage.setItem("employees", JSON.stringify(employees));

      return ok();
    }

    function deleteUser() {
      if (!isLoggedIn()) return unauthorized();

      employees = employees.filter(x => x.id !== idFromUrl());

      localStorage.setItem("employees", JSON.stringify(employees));
      return ok();
    }

    // helper functions
    
    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: "Unauthorised" } });
    }

    function isLoggedIn() {
      return headers.get("Authorization") === "Bearer fake-jwt-token";
    }

    function idFromUrl() {
      const urlParts = url.split("/");
      return parseInt(urlParts[urlParts.length - 1]);
    }

    function isAdmin() {
      const user = employees.find(x => x.id === idFromUrl());
      if (user.role === Role.Admin) {
        return user.role === Role.Admin;
      }
    }

    //calcular los dias de vacaciones.
    function calcularDiaVaciones(employee: Employee) {
      const contrato = new Date(employee.fechaContrato);
      const now = new Date(Date.now());
      if (employee) {
        if (contrato > now) {
          return 0;
        } else {
          const mesTrabajo = 2.5;

          const timeDiff = Math.abs(now.getTime() - contrato.getTime());
          // days
          const diffDays = timeDiff / 86400000;

          const diffYear = diffDays / 365;

          const diffMonth = diffYear * 12;

          const diaVacaciones = Math.floor(diffMonth * mesTrabajo);
          return diaVacaciones;
        }
      }
    }

    //actualizar el dia de vacaciones todos los dias.
    function actualizarDatos() {
      employees.forEach(function(value) {
        if (value.vacacionPedido > 0) {
          value.diaVacaciones =
            calcularDiaVaciones(value) * 1 - value.vacacionPedido * 1;
        } else {
          value.diaVacaciones = calcularDiaVaciones(value);
        }

        let user = employees.find(x => x.id === value.id);

        // update and save user
        Object.assign(user, value);
      });
      localStorage.setItem("employees", JSON.stringify(employees));
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
