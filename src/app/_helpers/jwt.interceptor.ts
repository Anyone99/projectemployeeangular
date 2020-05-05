//json web token, sirve para autorizar
import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../environments";
import { EmployeeService } from "../_services";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private employeeService: EmployeeService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const employee = this.employeeService.employeeValue;
    const isLoggedIn = employee && employee.token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${employee.token}` }
      });
    }
    return next.handle(request);
  }
}
