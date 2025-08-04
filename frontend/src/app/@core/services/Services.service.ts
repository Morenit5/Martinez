import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '@env/environment';
import { plainToInstance } from 'class-transformer';
import { ServiceEntity } from '../entities/Service.entity';



@Injectable({ providedIn: 'root', })
export class ServicesInstances {

    constructor(private readonly servicesListService:servicesService ){}
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

    apiUrl = environment.apiUrl + '/service';
    constructor(private readonly http: HttpClient) { }

    getAllServices() {
        return this.http.get<any>(this.apiUrl);
        //.subscribe(data => { console.log(data); });
    }
}