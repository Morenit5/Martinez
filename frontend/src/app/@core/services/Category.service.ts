import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { iCategory } from '../interfaces/Category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  // we can now access environment.apiUrl
  apiUrl = environment.apiUrl + '/category';

  handleError(handleError: any) {
    throw new Error('Method not implemented.');
  }

  getAllCategories(): Observable<iCategory[]> {
    //console.log("Vamo a ver que nos trae el Fetch " + this.apiUrl)
    return this.http.get<iCategory[]>(this.apiUrl);
  }


  addCategory(category: iCategory): Observable<iCategory> {
    console.log('TOOL ' + JSON.stringify(category));

    let regresa = this.http.post<iCategory>(
      this.apiUrl,
      JSON.stringify(category),
    );
    //console.log('REGRESA '+regresa);
    return regresa;
  }

  updateCategory(category: iCategory): Observable<iCategory> {

    let params = new HttpParams();
    params = params.set('id', category.categoryId);
    console.log('LLEGA A SERVICE -PARAMS '+ params);

    let instance = this.http.put<iCategory>(this.apiUrl + '/up/' + category.categoryId, category, { params: params });

    return instance;
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
