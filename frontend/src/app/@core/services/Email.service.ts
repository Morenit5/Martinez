import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceEntity } from '../entities/Service.entity';
import { environment } from '@env/environment';
import { ConfigurationEntity } from '../entities/Configuration.entity';

@Injectable({ providedIn: 'root' })
export class EmailService {

  // we can now access environment.apiUrl
  apiUrlSend = environment.apiUrl + '/mail/send';
  apiUrlDown = environment.apiUrl + '/mail/download';
  apiUrlInvoice = environment.apiUrl + '/mail/invoice';
  apiUrlEnable = environment.apiUrl + '/mail/notify';
  apiUrlEnableStatus = environment.apiUrl + '/mail/notify/status';
  apiUrlConfig = environment.apiUrl + '/mail/config';

  constructor(private http: HttpClient) { }

  sendEmail(service: ServiceEntity): Observable<any> {
     
     return this.http.post(this.apiUrlSend, service);
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

    addConfiguration(configuration: ConfigurationEntity): Observable<ConfigurationEntity> {
      console.log('Email.service: '+JSON.stringify(configuration));
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      let regresa = this.http.post<ConfigurationEntity>(this.apiUrlConfig, JSON.stringify(configuration),{ headers });
      console.log('Email.service front: '+regresa);
      return regresa;
    }

      updateConfiguration(configuration: ConfigurationEntity): Observable<ConfigurationEntity> {
        let params = new HttpParams();
        params = params.set('id', configuration.configurationId);
        let instance = this.http.put<ConfigurationEntity>(this.apiUrlConfig + '/up/' + configuration.configurationId, configuration, { params: params });
        return instance;
      }

      getConfig(): Observable<ConfigurationEntity[]>{

    return this.http.get<ConfigurationEntity[]>(this.apiUrlConfig);
  }
}