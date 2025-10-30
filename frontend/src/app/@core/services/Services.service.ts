import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
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
        /*return this.userService.updateUser(usrInstance).pipe(
          map((response) =>
              response.map((user: any) => plainToInstance(UserEntity, user)),
          ),
        );*/

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


}