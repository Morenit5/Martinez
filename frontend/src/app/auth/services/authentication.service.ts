import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, lastValueFrom, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { CredentialsService } from '@app/auth';
import { Credentials } from '@core/entities';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { instanceToPlain } from 'class-transformer';
import { Router } from '@angular/router';
import { ToastUtility } from '@app/@core/utils/toast.utility';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
  isMobile?: boolean;
}

const baseUrl = environment.apiUrl;
const loginUrl = baseUrl + '/auth/login';
const logoutUrl = baseUrl + '/auth/logout';
const refreshTokenUrl = baseUrl + '/auth/refresh';


/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({ providedIn: 'root', })
export class AuthenticationService {
constructor(private readonly _credentialsService: CredentialsService,private readonly http: HttpClient,private readonly router: Router,private toast: ToastUtility) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  async login(context: LoginContext): Promise<Observable<Credentials>> {

    const credentials: Credentials = new Credentials({
      username: context.username,
      password: context.password,
      id: '',
      token: '123456',
      refreshToken: '123456',
      expiresIn: 3600,
      roles: [],
      email: 'john@email.com',
      firstName: 'John',
      lastName: 'Doe',
    });
    
    
    return this.http.post<any>(loginUrl, instanceToPlain(credentials)).pipe(
      map(res => {
        if (res) {
          //console.log('Login successful con ');
          console.log(JSON.stringify(res))

          credentials.id = res.userId;
          credentials.token = res.token;
          credentials.refreshToken = res.refreshToken;
          credentials.expiresIn = res.expiresIn;
          credentials.roles.push(res.rolName);
          credentials.firstName = res.userName

          if(res.fu == true){
            this.toast.showToast('Usuario actualizado correctamente, porfavor inicia session con tu nuevo usuario!!', 7000, 'check2-circle', true);
            setTimeout(() => {
              this.signOutIntialUser();
            }, 3000); 
            
          }else {
            this._credentialsService.setCredentials(credentials, context.remember);
          }
          
        }
        return credentials;
      }
    ));
     
  
  }



refreshToken(): Observable<any> {

    const newCredentials = this._credentialsService.credentials;
    const { refreshToken } = this._credentialsService.credentials || {};
    if (!newCredentials.refreshToken) {
      this.logout();
    }
    console.log('tratando de refrescar el token' );

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + refreshToken
    });

    return this.http.post(refreshTokenUrl, instanceToPlain(newCredentials),{ headers }).pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle unauthorized error, e.g., redirect to login
          console.error('Unauthorized access. Redirecting to login.');
          // this.router.navigate(['/login']);
        } else {
          // Handle other errors
          console.error('An error occurred:', error.message);
        }
        return throwError(() => new Error('Something bad happened; please try again later.'));
      }),

      tap((response: any) => {
        console.log('llego al front authentication esto == > ' + response)
        newCredentials.token = response.accessToken;
        newCredentials.refreshToken = response.refreshToken;

        this._credentialsService.setCredentials(newCredentials);
       
        return response;

      }),
      catchError((error) => {
       
        return throwError(() => error);
      })
    );
  }


  private  signOutIntialUser() {
    if (!this._credentialsService.isAuthenticated()) {
      this._credentialsService.setCredentials();
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    } else {
      this.logout().subscribe({
        next: () => {
         this._credentialsService.setCredentials();
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });
        },
        error: () => {
          console.error('Error logging out');
        },
      });
    }
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<any> {
    const currentCredentials = this._credentialsService.credentials;
    
    const credentials: Credentials = new Credentials({
      id: currentCredentials.id,
      token: currentCredentials.token,
      refreshToken: currentCredentials.refreshToken,
      expiresIn: 3600,
      
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + currentCredentials.token
    });

    return this.http.post<any>(logoutUrl, instanceToPlain(credentials),{ headers }).pipe(
      map(res => {
        console.log('logout exitoso')
        return of(true);
      }
    ));

    
  }
}
