import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ClientEntity } from '../entities/Client.entity';
import { plainToInstance } from 'class-transformer';


@Injectable({ providedIn: 'root', })
export class ClientInstances {

    constructor(private readonly clientListService:ClientService ){}
    getAllClients() {
        return this.clientListService.getAllClients().pipe(
            map((response) =>
                response.map((client: any) => plainToInstance(ClientEntity, client)),
            ),
        );
    }

  getAllClientsBy(cltType:string) {
    return this.clientListService.getAllClientsBy(cltType).pipe(
      map((response) =>
        response.map((client: any) => plainToInstance(ClientEntity, client)),
      ),
    );
  }

}

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

  getAllClientsBy(cltType:string): Observable<ClientEntity[]> {
    let params = new HttpParams();
    params = params.set('typeName', cltType);


    return this.http.get<any>(this.apiUrl + '/type', { params: params });
            //.subscribe(data => { console.log(data); });
  }


  addClient(client: ClientEntity): Observable<ClientEntity> {
    //console.log('CLIENTE ' + JSON.stringify(client));
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let regresa = this.http.post<ClientEntity>(this.apiUrl, JSON.stringify(client),{headers});
    return regresa;
  }

  updateClient(client: ClientEntity): Observable<ClientEntity> {
    
    let params = new HttpParams();
    params = params.set('id', client.clientId);
    let instance = this.http.put<ClientEntity>(this.apiUrl + '/up/' + client.clientId, client, { params: params });
    return instance;
  }
}
