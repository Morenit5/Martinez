import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '../services/misc';
import { AuthenticationService } from '@app/auth/services/authentication.service';

const log = new Logger('ErrorHandlerInterceptor');

/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(
    private readonly authService: AuthenticationService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage;
        //console.log('error interceptor ' + JSON.stringify(error))
        switch (error.status) {
          case 401:
            if (error.url.endsWith('refresh')) {
              this.authService.logout();
            }else{
              errorMessage = error;
            }
            break;
          case 403:
            if (error.url.endsWith('refresh')) {
              this.authService.logout();
            }else{
              errorMessage = error;
            }
            break;
          
          default:
            //console.log('entro en el default')
            errorMessage = error;
        }

        
        //console.log('interceptor error: ' + JSON.stringify(error));
        return throwError(() => errorMessage/*error*/);
      })
    );
  }

  //TODO: Customize the default error handler here if needed
  private _errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {

    if (!environment.production) {
      // Do something with the error
      log.error('Request error', response);
    }
    throw response;
  }
}
