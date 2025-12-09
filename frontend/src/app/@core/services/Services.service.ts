import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ServiceEntity } from '../entities/Service.entity';


const baseUrl = environment.apiUrl;
const serviceUrl = baseUrl + '/service';


@Injectable({ providedIn: 'root', })
export class ServicesInstances {
    
    constructor(private readonly servicesListService:servicesService ){}

    addService(serviceIstance: ServiceEntity) {
        return this.servicesListService.addService(serviceIstance).pipe(
            map((response) => {
                return plainToInstance(ServiceEntity, response);
            }),
        );
    }

  
    updateService(serviceIstance: ServiceEntity) {


        return this.servicesListService.updateService(serviceIstance).pipe(
            //tap(value => console.log('Observable value:', value))
            map(response => {
                if (Array.isArray(response)) {
                    return response.map((service: any) => plainToInstance(ServiceEntity, service))
                } else {
                    // it's a single object, transform directly
                    return plainToInstance(ServiceEntity, response)
                }
            })
        );
    }

      
    generateInvoice(serviceIstance: ServiceEntity) {


        return this.servicesListService.generateInvoice(serviceIstance).pipe(
            //tap(value => console.log('Observable value:', value))
            map(response => {
                if (Array.isArray(response)) {
                    return response.map((service: any) => plainToInstance(ServiceEntity, service))
                } else {
                    // it's a single object, transform directly
                    return plainToInstance(ServiceEntity, response)
                }
            })
        );
    }

    getAllServices() {
        return this.servicesListService.getAllServices().pipe(
            map((response) =>
                response.map((service: any) => plainToInstance(ServiceEntity, service)),
            ),
        );
    }

    getAllEnabled() {
        return this.servicesListService.getAllEnabled().pipe(
            map((response) =>
                response.map((service: any) => plainToInstance(ServiceEntity, service)),
            ),
        );
    }

    getAllServicesBy(clientType:string,extra?:boolean) {

        return this.servicesListService.getAllServicesBy(clientType, extra ).pipe(
            map((response) =>
                response.map((service: any) => plainToInstance(ServiceEntity, service)),
            ),
        );
    }

     getAllClosedServicesBy(clientFirst?:string,clientLast?:string,month?:string) {
        return this.servicesListService.getAllClosedServicesBy(clientFirst,clientLast,month).pipe(
            map((response) =>
                response.map((service: any) => plainToInstance(ServiceEntity, service)),
            ),
        );
    }

    getAllServicesByPaymentCash(paymentMethod?:string) {
        return this.servicesListService.getAllServicesByPaymentCash(paymentMethod).pipe(
            map((response) =>
                response.map((service: any) => plainToInstance(ServiceEntity, service)),
            ),
        );
}

    getAutoInvoiceStatus(): Observable<any>{
        return this.servicesListService.getNewInvoiceStatus();

    }

    getInvoicesXMonth(serviceId: number, invoicedMonth:string) {

        return this.servicesListService.getInvoicesXMonth(serviceId, invoicedMonth).pipe(
            tap(value => value),// console.log('Observable value:', value)),
        );
      }


}

@Injectable({ providedIn: 'root', })
class servicesService {
   
    constructor(private readonly http: HttpClient) { }

    getAllServices() {
        return this.http.get<any>(serviceUrl);
        //.subscribe(data => { console.log(data); });
    }

    getAllEnabled() {
        return this.http.get<any>(serviceUrl + '/enabled');
        //.subscribe(data => { console.log(data); });
    }

    getAllClosedServicesBy(clientFirst?:string,clientLast?:string,month?:string) {

        let params = new HttpParams();
       
        if(clientFirst != undefined){
            params = params.set('name', clientFirst);
        }
        if(clientLast != undefined){
            params = params.set('lastName', clientLast);
        }
        if(month != undefined){
            params = params.set('date', month);
        }

        return this.http.get<any>(serviceUrl + '/closed',{ params: params });
        //.subscribe(data => { console.log(data); });
    }

    getAllServicesByPaymentCash(paymentMethod?: string) {
       let params = new HttpParams();
       
        if(paymentMethod != undefined){
            params = params.set('paymentMethod', paymentMethod);
        }
        return this.http.get<any>(serviceUrl + '/cclosed',{ params: params });
        
    }

    getAllServicesBy(clientType:string,extra?:boolean) {
        let params = new HttpParams();
        params = params.set('typeName', clientType);
        if(extra != undefined){
            params = params.set('extra', extra);
        }
        //console.log('vamos a llamar esto' + clientType)
        return this.http.get<any>(serviceUrl + '/type',{ params: params });
        //.subscribe(data => { console.log(data); });
    }

    addService(serviceInstance: ServiceEntity) {
        let regresa = this.http.post<any>(serviceUrl, instanceToPlain(serviceInstance),);
        //console.log(regresa)
        return regresa;
    }

   
    updateService(serviceIstance: ServiceEntity)  {
        //let params = new HttpParams();
        //params = params.set('id', serviceIstance.serviceId);

        let instance = this.http.put<any>(serviceUrl + '/up/' + serviceIstance.serviceId, serviceIstance,); //{ params: params });

        return instance;
    }

     generateInvoice(serviceIstance: ServiceEntity)  {
        //let params = new HttpParams();
        //params = params.set('id', serviceIstance.serviceId);
        let instance = this.http.put<any>(serviceUrl + '/generateInvoice/' + serviceIstance.serviceId, serviceIstance,); //{ params: params });

        return instance;
    }
    
    getNewInvoiceStatus() {
    
        return this.http.get(serviceUrl + '/autoinvoice/status');
       
      }


      getInvoicesXMonth(serviceId: number, invoicedMonth: string)  {
       let params = new HttpParams();
       
       params = params.set('serviceId', serviceId);
        params = params.set('invoicedMonth', invoicedMonth);
        return this.http.get<any>(serviceUrl + '/existsinvoice',{ params: params });
    }

}