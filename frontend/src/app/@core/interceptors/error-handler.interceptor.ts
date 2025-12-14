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
        switch (error.status) {
          case 400:
            errorMessage = `Bad Request: ${error.error.message || error.statusText}`;
            // this.toastr.error(errorMessage);
            break;
          case 401:
            if (error.url.endsWith('refresh')) {
              this.authService.logout();
            }
            break;
          case 403:
            if (error.url.endsWith('refresh')) {
              this.authService.logout();
            }
            break;
          case 404:
            errorMessage = `Not Found: ${error.error.message || error.statusText}`;
            break;
          case 500:
             errorMessage = error.error;
            break;
          default:
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
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
