import { Injectable } from '@angular/core';
import { Credentials } from '@core/entities';

const credentialsKey = 'credentials';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {

  private _credentials: Credentials | null = null;

  constructor() {
    const savedCredentials = localStorage.getItem(credentialsKey);
    
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember:boolean = false) {
    //por ahora no usaremos el remember entonces lo deshabilitamos con un false

    this._credentials = credentials || null;

    if (credentials) {
      //const storage = remember ? localStorage : sessionStorage;
      localStorage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      //sessionStorage.removeItem(credentialsKey);
      
      localStorage.removeItem(credentialsKey);
      this._credentials = null;
    }
  }
}
