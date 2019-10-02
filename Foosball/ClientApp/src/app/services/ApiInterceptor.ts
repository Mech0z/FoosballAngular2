import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const baseUrl = 'https://betafoosballapi.azurewebsites.net';
        const apiReq = req.clone({ url: `${baseUrl}${req.url}` });
        return next.handle(apiReq);
    }
}
