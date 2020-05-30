import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../environment";
import { AccountService } from "../_services";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // agregue el encabezado auth con jwt si el usuario ha iniciado sesión y la solicitud es a la api url

    const employee = this.accountService.employeeValue;
    const isLoggedIn = employee && employee.token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${employee.token}`
        }
      });
    }

    return next.handle(request);
  }
}
