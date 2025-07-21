import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToolEntity } from '@app/@core/entities/Tool.entity';
import { map, Observable } from 'rxjs';
import { iTool } from '../interfaces/Tool.interface';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class ToolService {
    constructor(private http: HttpClient) { }

    // we can now access environment.apiUrl
    apiUrl = environment.apiUrl + '/tool';
    tools: ToolEntity[] = [];// se crea un array vacio de la interfaz
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

    fetchData1(): Observable<iTool[]> {

    console.log("Vamo a ver que nos trae el Fetch " + this.apiUrl)
    return this.http.get<iTool[]>(this.apiUrl);
  }

    async getAllTool(): Promise<iTool[]> {
        const data = await fetch(this.apiUrl);
        return (await data.json()) ?? [];
    }

    obtenerHerramientas(): Observable<ToolEntity[]> {
        return this.http.get<ToolEntity[]>(this.apiUrl);
    }

    async getToolById(id: number): Promise<ToolEntity | undefined> {
        const data = await fetch(`${this.apiUrl}?id=${id}`);
        const toolJson = await data.json();
        return toolJson[0] ?? {};
    }

    submitApplication(name: string, code: string, status: string) {
        console.log(`Herramienta: nombre: ${name}, código: ${code}, estatus: ${status}.`,);
    }

    /*crearHerramienta(herramienta: ToolEntity): Observable<ToolEntity> {
        return this.http.post<ToolEntity>(this.apiUrl, herramienta);
    }*/
}