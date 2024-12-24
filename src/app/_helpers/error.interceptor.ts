import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../modules/auth';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
       console.log(err);
        if ([401, 403, 504, 0].includes(err.status)) {
          // auto logout if 401 or 403 or 504 or 0 response returned from api
          this.authService.logout();
          // document.location.reload();
        }
        let error =
          err.error?.data !== undefined && err.error?.data && err.error?.data == Object && err.error?.data !== '' 
            ? err.error?.data
            : err.error?.message ;
            
        console.log(error);

        return throwError(error);
      })
    );
  }
}
