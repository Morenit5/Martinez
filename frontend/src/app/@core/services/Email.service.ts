import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceEntity } from '../entities/Service.entity';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private apiUrl = 'http://localhost:3001/api/v1/mail/send';
  private apiUrl2 = 'http://localhost:3001/api/v1/mail/download';
  private apiUrl3 = 'http://localhost:3001/api/v1/mail/invoice';
  
  constructor(private http: HttpClient) {}

  sendEmail(service: ServiceEntity): Observable<any> {
    //console.log('EMAIL.SERVICE: '+JSON.stringify(service));
    return this.http.post(this.apiUrl, JSON.stringify(service));
  }

  async generateInvoice(service: ServiceEntity): Promise<Observable<any>>
  {
       let variable= this.http.post(this.apiUrl2, service, {
        responseType: 'blob', // Important: Set responseType to 'blob'
        headers: {
          'Accept': 'application/pdf' // Optional: Indicate preference for PDF
        }});
        return variable;
        
  }

  async getInvoiceByClient(invoiceName: string): Promise<Observable<any>> {
    let myparams = new HttpParams();
    myparams = myparams.append('name', invoiceName);
    
    let variable = this.http.get(this.apiUrl3, {
      responseType: 'blob', // Important: Set responseType to 'blob'
      params: myparams,
      headers: {
        'Accept': 'application/pdf'
      }
    });
    return variable;

  }


}