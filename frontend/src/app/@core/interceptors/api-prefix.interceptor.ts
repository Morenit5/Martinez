import { inject, Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, takeUntil, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { AuthenticationService, CredentialsService } from '@auth';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  private readonly _ongoingRequests = new Map<string, Subject<any>>();
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  newAccessToken: any;
  constructor(
    private readonly _credentialsService: CredentialsService,
    private readonly _translateService: TranslateService,
     private readonly authService: AuthenticationService,
     private readonly router: Router
  ) {}

  intercept(request: HttpRequest<any>,next: HttpHandler,): Observable<HttpEvent<any>> {

    // If the request has the 'noauth' header, don't add the Authorization header
    if (request.headers.get('noauth')) {
      //console.log('interceptamos request sin authorization')
      return next.handle(request);
    }

    let headers = request.headers;
    const { token } = this._credentialsService.credentials || {};
    const { refreshToken } = this._credentialsService.credentials || {};

    if (token) {
      if (!(request.body instanceof FormData)) {
        headers = headers.set('content-type', 'application/json');
      }

      if(request.url.endsWith('refresh')){
        headers = headers.set('Authorization', `Bearer ${refreshToken}`);
      }else {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      
    }

    request = request.clone({ headers });

    /**
     * In below piece of code If there is an ongoing request with the same method and URL than return the ongoing request instead of creating a new one
     * This is useful when the user clicks multiple times on a button that triggers a request
     */

    const requestKey = this._getRequestKey(request);

    const ongoingRequest = this._ongoingRequests.get(requestKey);
    if (ongoingRequest) {
      return ongoingRequest.asObservable();
    } else {
      const cancelSubject = new Subject<any>();
      this._ongoingRequests.set(requestKey, cancelSubject);

      return next.handle(request).pipe(takeUntil(cancelSubject),catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
            return this.handle401Error(request, next);
            
          } else{
            console.log(error);
            return throwError(() => error/*.errormessage*/); //throwError(error);
          }
         
        }),
        finalize(() => {
          this._ongoingRequests.delete(requestKey);
          cancelSubject.complete();
        }),
      );
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
       
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // Clear previous token

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token); // Emit new token
          return next.handle(this.addToken(request, token));
        }),
        catchError((err) => {
          if (request.url.endsWith('refresh')) {
            
            this.isRefreshing = false;
            this.authService.logout().subscribe({
              next: () => {
                this._credentialsService.setCredentials();
                this.router.navigate(['/login']).then(() => {
                  window.location.reload();
                });
              },
              error: () => {
                console.error('Error logging out');
              },
            }); // Handle refresh token expiry
            return throwError(() => new Error(err)) //throwError(err);
          }
          return throwError(() => new Error(err))
          
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }

  private _getRequestKey(req: HttpRequest<any>): string {
    return `${req.method} ${req.urlWithParams}`;
  }
}
