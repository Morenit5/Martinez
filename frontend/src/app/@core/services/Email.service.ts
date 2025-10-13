import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceEntity } from '../entities/Service.entity';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class EmailService {

  // we can now access environment.apiUrl
  apiUrlSend = environment.apiUrl + '/mail/send';
  apiUrlDown = environment.apiUrl + '/mail/download';
  apiUrlInvoice = environment.apiUrl + '/mail/invoice';

  constructor(private http: HttpClient) { }

  sendEmail(service: ServiceEntity): Observable<any> {
     return this.http.post(this.apiUrlSend, JSON.stringify(service));
  }

  async generateInvoice(service: ServiceEntity): Promise<Observable<any>> {
    let variable = this.http.post(this.apiUrlDown, service, {
      responseType: 'blob', // Important: Set responseType to 'blob'
      headers: {
        'Accept': 'application/pdf' // Optional: Indicate preference for PDF
      }
    });
    return variable;
  }

  async getInvoiceByClient(invoiceName: string): Promise<Observable<any>> {
    let myparams = new HttpParams();
    myparams = myparams.append('name', invoiceName);

    let variable = this.http.get(this.apiUrlInvoice, {
      responseType: 'blob', // Important: Set responseType to 'blob'
      params: myparams,
      headers: {
        'Accept': 'application/pdf'
      }
    });
    return variable;
  }
}