import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

    
    getAllServices() {
        return this.servicesListService.getAllServices().pipe(
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

    addService(serviceInstance: ServiceEntity) {
        let regresa = this.http.post<any>(serviceUrl, instanceToPlain(serviceInstance),);
        //console.log(regresa)
        return regresa;
    }
}