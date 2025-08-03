import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '@env/environment';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../entities/User.entity';


@Injectable({ providedIn: 'root', })
export class UsersInstances {

    constructor(private readonly userService:UsersService ){}
    getAllUsers() {
        return this.userService.getAllUsers().pipe(
            map((response) =>
                response.map((user: any) => plainToInstance(UserEntity, user)),
            ),
        );
    }

}


@Injectable({ providedIn: 'root', })
class UsersService {

    apiUrl = environment.apiUrl + '/user';
    constructor(private readonly http: HttpClient) { }

    getAllUsers() {
        return this.http.get<any>(this.apiUrl);
        //.subscribe(data => { console.log(data); });
    }
}