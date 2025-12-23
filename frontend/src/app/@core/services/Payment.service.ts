import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaymentEntity } from '@app/@core/entities/Payment.entity';
import { Observable } from 'rxjs';
import { iPayment } from '../interfaces/Payment.interface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  // we can now access environment.apiUrl
  apiUrl = environment.apiUrl + '/payment';
  paymentId = '';
  updateDelete = this.apiUrl + '/up';
  payments: PaymentEntity[] = []; // se crea un array vacio de la interfaz
  newPayment: PaymentEntity;

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

  fetchData1(): Observable<iPayment[]> {
    return this.http.get<iPayment[]>(this.apiUrl);
  }

  /*create(tool: ToolEntity): Observable<ToolEntity> {
        console.log(' CREATE '+ JSON.stringify(tool));
    return this.http.post<ToolEntity>(this.apiUrl, JSON.stringify(tool));
  }*/

  add(payment: PaymentEntity): Observable<PaymentEntity> {
    //console.log('PAYMENT ' + JSON.stringify(payment));

    let regresa = this.http.post<PaymentEntity>(this.apiUrl, JSON.stringify(payment));
    //console.log('REGRESA '+regresa);
    return regresa;
  }

  async update(id: number, payment: PaymentEntity) {
    let params = new HttpParams();
    params = params.set('id', id).set('enabled', payment.enabled);
    this.http
      .put(this.updateDelete + '/' + id, payment, { params: params }).subscribe();
  }

  getValores() {
    throw new Error('Method not implemented.');
  }

  async getAllTool(): Promise<iPayment[]> {
    const data = await fetch(this.apiUrl);
    return (await data.json()) ?? [];
  }

  obtenerHerramientas(): Observable<PaymentEntity[]> {
    return this.http.get<PaymentEntity[]>(this.apiUrl);
  }

  async getToolById(id: number): Promise<PaymentEntity | undefined> {
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
