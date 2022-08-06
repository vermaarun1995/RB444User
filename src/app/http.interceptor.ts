import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionService } from './services/session.service';
import { LoaderService } from './services/loader.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
    constructor(private router: Router, private sessionService: SessionService, private loaderService : LoaderService) { console.log("a"); }
    public userToken = "1255";
    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // if (this.userToken) {
        //     const tokenReq: HttpRequest<any> = httpRequest.clone({
        //         setHeaders: {
        //             Authorization: `Bearer ${this.userToken}`
        //         }
        //     });
        //     return next.handle(tokenReq);
        // }
        // catch any errors. Ensure user is logged out if necessary and have them log in

        //this.loaderService.show();
        if(httpRequest.url.includes("GetMatchOdds")!=true){
            this.loaderService.isLoading.next(true);
        }
        return next.handle(httpRequest).pipe(
            finalize(() => {
                this.loaderService.isLoading.next(false);
            })
        );
    }
}