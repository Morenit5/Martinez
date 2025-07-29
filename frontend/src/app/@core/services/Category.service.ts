import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CategoryEntity } from '../entities/Category.entity';
import { iCategory } from '../interfaces/Category.interface';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    constructor(private http: HttpClient) { }

    // we can now access environment.apiUrl
    apiUrl = environment.apiUrl + '/category';
    categories: CategoryEntity[] = [];// se crea un array vacio de la interfaz
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

    fetchData1(): Observable<iCategory[]> {
    //console.log("Vamo a ver que nos trae el Fetch " + this.apiUrl)
    return this.http.get<iCategory[]>(this.apiUrl);
  }

    async getAllTool(): Promise<iCategory[]> {
        const data = await fetch(this.apiUrl);
        return (await data.json()) ?? [];
    }

    add(category: CategoryEntity): Observable<CategoryEntity> {
    
            console.log('TOOL ' + JSON.stringify(category));
    
            let regresa = this.http.post<CategoryEntity>(this.apiUrl, JSON.stringify(category));
            //console.log('REGRESA '+regresa); 
            return regresa;
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