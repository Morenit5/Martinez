import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '@env/environment';
import { plainToInstance } from 'class-transformer';
import { RolEntity, UserEntity } from '../entities/User.entity';

const baseUrl = environment.apiUrl;
const userUrl = '/user';
const rolUrl = '/roles';
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

    constructor(private readonly http: HttpClient) { }

    getAllUsers() {
        return this.http.get<any>(baseUrl + userUrl);
        //.subscribe(data => { console.log(data); });
    }
}

@Injectable({ providedIn: 'root', })
export class RolesInstances {

    constructor(private readonly rolesService: RolesService) { }

    getAllRoles() {
        return this.rolesService.getAllRoles().pipe(
            map((response) =>
                response.map((rol: any) => plainToInstance(RolEntity, rol)),
            ),
        );
    }
}

@Injectable({ providedIn: 'root', })
class RolesService {

    constructor(private readonly http: HttpClient) { }

    getAllRoles() {
        return this.http.get<any>(baseUrl+rolUrl);
        //.subscribe(data => { console.log(data); });
    }
}
