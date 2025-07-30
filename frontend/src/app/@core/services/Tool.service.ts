import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToolEntity } from '@app/@core/entities/Tool.entity';
import { Observable } from 'rxjs';
import { iTool } from '../interfaces/Tool.interface';
import { environment } from '@env/environment';
import { CategoryEntity } from '../entities/Category.entity';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  constructor(private http: HttpClient) {}

  // we can now access environment.apiUrl
  apiUrl = environment.apiUrl + '/tool';
  apiUrlCat = environment.apiUrl + '/category';
  toolId = '';
  updateDelete = this.apiUrl + '/up';
  tools: ToolEntity[] = []; // se crea un array vacio de la interfaz
  newTool: ToolEntity;

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
    return this.http.get<iTool[]>(this.apiUrl);
  }

  /*create(tool: ToolEntity): Observable<ToolEntity> {
        console.log(' CREATE '+ JSON.stringify(tool));
    return this.http.post<ToolEntity>(this.apiUrl, JSON.stringify(tool));
  }*/

  add(tool: ToolEntity): Observable<ToolEntity> {
    console.log('TOOL ' + JSON.stringify(tool));

    let regresa = this.http.post<ToolEntity>(this.apiUrl, JSON.stringify(tool));
    //console.log('REGRESA '+regresa);
    return regresa;
  }

  async update(id: number, tool: ToolEntity) {
    let params = new HttpParams();
    params = params.set('id', id).set('enabled', tool.enabled);
    this.http
      .put(this.updateDelete + '/' + id, tool, { params: params })
      .subscribe();
  }

  getCategories(): Observable<CategoryEntity[]> {
    return this.http.get<CategoryEntity[]>(this.apiUrlCat);
  }

  getValores() {
    throw new Error('Method not implemented.');
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
    console.log(
      `Herramienta: nombre: ${name}, código: ${code}, estatus: ${status}.`,
    );
  }

  /*async updateTool(id: number, tool: ToolEntity) {
    const herramienta = await this.repo.findOneBy({ id });
    if (!herramienta) {
        throw new Error('Herramienta no encontrada');
    }
    Object.assign(herramienta, tool);
    return this.repo.save(herramienta);
}*/
}
