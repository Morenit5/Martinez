import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  handleError(handleError: any) { throw new Error('Method not implemented.'); }

  getAllCategories(): Observable<iCategory[]> {
   return this.http.get<iCategory[]>(this.apiUrl);
  }

  addCategory(category: iCategory): Observable<iCategory> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let regresa = this.http.post<iCategory>(this.apiUrl, JSON.stringify(category),{ headers });
    return regresa;
  }

  updateCategory(category: iCategory): Observable<iCategory> {
    let params = new HttpParams();
    params = params.set('id', category.categoryId);
    let instance = this.http.put<iCategory>(this.apiUrl + '/up/' + category.categoryId, category, { params: params });
    return instance;
  }
}
