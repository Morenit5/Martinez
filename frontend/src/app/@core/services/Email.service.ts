import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceEntity } from '../entities/Service.entity';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private apiUrl = 'http://localhost:3001/api/v1/mail/send';

  constructor(private http: HttpClient) {}

  sendEmail(service: ServiceEntity): Observable<any> {
    //console.log('EMAIL.SERVICE: '+JSON.stringify(service));
    return this.http.post(this.apiUrl, JSON.stringify(service));
  }
}