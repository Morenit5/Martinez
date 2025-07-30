import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ClientEntity } from '../entities/Client.entity';
import { iClient } from '../interfaces/Client.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient) {}

  // we can now access environment.apiUrl
  apiUrl = environment.apiUrl + '/client';
  clients: ClientEntity[] = []; // se crea un array vacio de la interfaz
  /*fetchData(): Observable<ToolEntity[]> {
        //console.log("Vamo a ver que nos trae el Fetch " + this.apiUrl)
        var result = this.http.get<ToolEntity[]>(this.apiUrl).pipe(map((response: any) => {
            this.tools = response;
            return this.tools;
        }))
            .subscribe(result => {
                console.log(result);
                return result;
            });
        return result;
    }*/
  handleError(handleError: any) {
    throw new Error('Method not implemented.');
  }

  fetchData1(): Observable<iClient[]> {
    //console.log("Vamo a ver que nos trae el Fetch " + this.apiUrl)
    return this.http.get<iClient[]>(this.apiUrl);
  }

  async getAllTool(): Promise<iClient[]> {
    const data = await fetch(this.apiUrl);
    return (await data.json()) ?? [];
  }

  /*obtenerHerramientas(): Observable<CategoryEntity[]> {
        return this.http.get<ToolEntity[]>(this.apiUrl);
    }*

    async getToolById(id: number): Promise<CategoryEntity | undefined> {
        const data = await fetch(`${this.apiUrl}?id=${id}`);
        const categoryJson = await data.json();
        return categoryJson[0] ?? {};
    }

    submitApplication(name: string, code: string, status: string) {
        console.log(`Categoria: nombre: ${name}, código: ${code}, estatus: ${status}.`,);
    }

    /*crearHerramienta(herramienta: ToolEntity): Observable<ToolEntity> {
        return this.http.post<ToolEntity>(this.apiUrl, herramienta);
    }*/
}
