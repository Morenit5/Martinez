import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ClientEntity } from '../entities/Client.entity';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient) {
   }

  // we can now access environment.apiUrl
  apiUrl = environment.apiUrl + '/client';
  updateDelete = this.apiUrl + '/up';
  clients: ClientEntity[] = []; // se crea un array vacio de la interfaz

  handleError(handleError: any) { throw new Error('Method not implemented.'); }

  fetchData1(): Observable<ClientEntity[]> {
    return this.http.get<ClientEntity[]>(this.apiUrl);
  }

  getAllClients(): Observable<ClientEntity[]> {
    return this.http.get<ClientEntity[]>(this.apiUrl);
  }

  addClient(client: ClientEntity): Observable<ClientEntity> {
    console.log('CLIENTE ' + JSON.stringify(client));

    let regresa = this.http.post<ClientEntity>(this.apiUrl, JSON.stringify(client));
    return regresa;
  }

  updateClient(client: ClientEntity): Observable<ClientEntity> {
    
    let params = new HttpParams();
    params = params.set('id', client.clientId);
    let instance = this.http.put<ClientEntity>(this.apiUrl + '/up/' + client.clientId, client, { params: params });
    return instance;
  }
}
