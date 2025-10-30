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
  apiUrlEnable = environment.apiUrl + '/mail/notify';
  apiUrlEnableStatus = environment.apiUrl + '/mail/notify/status';

  constructor(private http: HttpClient) { }

  sendEmail(service: ServiceEntity, invoiceIndex:number): Observable<any> {
    let myparams = new HttpParams();
    myparams = myparams.append('invoiceIndex', invoiceIndex);

    return this.http.post(this.apiUrlSend, service, {params: myparams});
  }

  async generateInvoice(service: ServiceEntity,invoiceIndex:number): Promise<Observable<any>> {

    let myparams = new HttpParams();
    myparams = myparams.append('invoiceIndex', invoiceIndex);
    

    let variable = this.http.post(this.apiUrlDown, service, {
      responseType: 'blob', // Important: Set responseType to 'blob'
      headers: {
        'Accept': 'application/pdf' // Optional: Indicate preference for PDF
      },
      params: myparams
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

  enableReminders(enable:boolean, date:number): Observable<any> {
    let myparams = new HttpParams();
    myparams = myparams.append('enable', enable);
    myparams = myparams.append('onDate', date);

    const httpOptions = {
      params: myparams
    };
    
    return this.http.post(this.apiUrlEnable, null, httpOptions);
  }

  getReminderStatus(): Observable<any>{


    let variable = this.http.get(this.apiUrlEnableStatus);
    return variable;
  }
}