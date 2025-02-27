import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    private count = 0;

    constructor(private loaderService: LoaderService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.count === 0) {
            this.loaderService.setHttpProgressStatus(true);
        }
        this.count++;
        return next.handle(req).pipe(
            finalize(() => {
                this.count--;
                if (this.count === 0) {
                    this.loaderService.setHttpProgressStatus(false);
                }
            })
        );
    }
}
export const loaderInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }];

