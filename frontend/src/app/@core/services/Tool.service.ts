import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ToolEntity } from '@app/@core/entities/Tool.entity';
import { Observable } from 'rxjs';
import { iTool } from '../interfaces/Tool.interface';
import { environment } from '@env/environment';
import { CategoryEntity } from '../entities/Category.entity';

@Injectable({
  providedIn: 'root',
})
export class ToolService {
  constructor(private http: HttpClient) { }

  // we can now access environment.apiUrl
  apiUrl = environment.apiUrl + '/tool';
  apiUrlCat = environment.apiUrl + '/category';
  apiUrlToolCat = environment.apiUrl + '/tool/catg';
  apiUrlUpload = this.apiUrl + '/upload';
  toolId = '';
  updateDelete = this.apiUrl + '/up';
  tools: ToolEntity[] = []; // se crea un array vacio de la interfaz
  newTool: ToolEntity;

  handleError(handleError: any) { throw new Error('Method not implemented.'); }

  fetchData1(): Observable<ToolEntity[]> {
    return this.http.get<ToolEntity[]>(this.apiUrlToolCat);
  }

  addTool(tool: ToolEntity): Observable<ToolEntity> {
    //console.log('TOOL ' + JSON.stringify(tool));
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let regresa = this.http.post<ToolEntity>(this.apiUrl, JSON.stringify(tool),{ headers });
    return regresa;
  }

   uploadToolImage(data: any) {
      let ret =  this.http.post<any>(this.apiUrlUpload, data) //.subscribe(resp => { console.log(JSON.stringify(resp)); });
      return ret;
    }

  updateDeleteTool(tool: ToolEntity): Observable<ToolEntity> {

    let params = new HttpParams();
      params = params.set('id', tool.toolId);
      let instance = this.http.put<ToolEntity>(this.apiUrl + '/up/' + tool.toolId, tool, { params: params });

      
      return instance;
  }

  updateTool(tool: ToolEntity): Observable<ToolEntity> {
      let params = new HttpParams();
      params = params.set('id', tool.toolId);
      let instance = this.http.put<ToolEntity>(this.apiUrl + '/up/' + tool.toolId, tool, { params: params });
      return instance;
    }

  getCategories(): Observable<CategoryEntity[]> {
    return this.http.get<CategoryEntity[]>(this.apiUrlCat);
  }

  getValores() { throw new Error('Method not implemented.');  }

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

}
