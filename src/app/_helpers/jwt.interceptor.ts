//json web token, sirve para autorizar 
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments';

/*@Injectable()
export class JwtInterceptor implements HttpInterceptor {

}*/