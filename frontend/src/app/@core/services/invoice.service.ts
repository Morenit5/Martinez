import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { InvoiceEntity } from '../entities/Invoice.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

const baseUrl = environment.apiUrl;
const serviceUrl = baseUrl + '/inv';

@Injectable({ providedIn: 'root', })
export class InvoiceInstances {

  constructor(private readonly invoiceService: InvoiceService) { }

  addInvoice(invoiceIstance: InvoiceEntity) {
    return this.invoiceService.addInvoice(invoiceIstance).pipe(
      map((response) => {
        return plainToInstance(InvoiceEntity, response);
      }),
    );
  }

  getAllInvoices() {
    return this.invoiceService.getAllInvoices().pipe(
      map((response) =>
        response.map((invoice: any) => plainToInstance(InvoiceEntity, invoice)),
      ),
    );
  }

  getAllInvoicesBy(esCash: string) {

    return this.invoiceService.getAllInvoicesBy(esCash).pipe(
      map((response) =>
        response.map((invoice: any) => plainToInstance(InvoiceEntity, invoice)),
      ),
    );
  }

}


@Injectable({providedIn: 'root'})
export class InvoiceService {

  constructor(private readonly http: HttpClient) { }
  
      getAllInvoices() {
          return this.http.get<any>(serviceUrl);
          //.subscribe(data => { console.log(data); });
      }
  
      getAllInvoicesBy(esCash:string) {
          let params = new HttpParams();
          params = params.set('efectivo', esCash);
          
          //console.log('vamos a llamar esto' + esCash)
          return this.http.get<any>(serviceUrl + '/cash',{ params: params });
          //.subscribe(data => { console.log(data); });
      }
  
      addInvoice(invoiceInstance: InvoiceEntity) {
          let regresa = this.http.post<any>(serviceUrl, instanceToPlain(invoiceInstance),);
          //console.log(regresa)
          return regresa;
      }
  

}
