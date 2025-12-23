import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { ServiceEntity } from '../entities/Service.entity';
import { environment } from '@env/environment';
import { ConfigurationEntity } from '../entities/Configuration.entity';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {

    // we can now access environment.apiUrl
    apiUrlSend = environment.apiUrl + '/configuration';
    configUrl = this.apiUrlSend + '/config';
    notificationStatus =  this.apiUrlSend +  '/notify/status';

    constructor(private http: HttpClient) { }



    setConfigurations(configuration: ConfigurationEntity): Observable<any> {
        return this.http.post(this.configUrl, configuration);
    
    }

    getReminderStatus(): Observable<any> {

        let variable = this.http.get(this.notificationStatus);
        return variable;
    }

    addConfiguration(configuration: ConfigurationEntity): Observable<ConfigurationEntity> {
        //console.log('Email.service: ' + JSON.stringify(configuration));
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let regresa = this.http.post<ConfigurationEntity>(this.configUrl, JSON.stringify(configuration), { headers });
        //console.log('Email.service front: ' + regresa);
        return regresa;
    }

    updateConfiguration(configuration: ConfigurationEntity): Observable<ConfigurationEntity> {
        let params = new HttpParams();
        params = params.set('id', configuration.configurationId);
        let instance = this.http.put<ConfigurationEntity>(this.configUrl + '/up/' + configuration.configurationId, configuration, { params: params });
        return instance;
    }

    getConfig(): Observable<ConfigurationEntity> {

        return this.http.get<ConfigurationEntity>(this.apiUrlSend);
    }
}