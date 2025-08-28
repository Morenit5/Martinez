import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { RolEntity, UserEntity } from '../entities/User.entity';


const baseUrl = environment.apiUrl;
const userUrl = '/user';
const rolUrl = '/roles';
@Injectable({ providedIn: 'root', })
export class UsersInstances {

     constructor(private readonly userService:UsersService ){}

    addUser(usrInstance: UserEntity) {
      return this.userService.addUser(usrInstance).pipe(
        map((response) =>{
            return plainToInstance(UserEntity, response);}
        ),
      );
       
    }

    updateUser(usrInstance: UserEntity) {
      /*return this.userService.updateUser(usrInstance).pipe(
        map((response) =>
            response.map((user: any) => plainToInstance(UserEntity, user)),
        ),
      );*/

      return this.userService.updateUser(usrInstance).pipe(
        //tap(value => console.log('Observable value:', value))
        map(response => {
          if (Array.isArray(response)) {
            return response.map((user: any) => plainToInstance(UserEntity, user))
          } else {
            // it's a single object, transform directly
            return plainToInstance(UserEntity, response)
          }
        })
      );
    }
    
    getAllUsers() {
        return this.userService.getAllUsers().pipe(
            map((response) =>
                response.map((user: any) => plainToInstance(UserEntity, user)),
            ),
        );
    }

    uploadUserAvatar(data: any) {
        return this.userService.uploadUserAvatar(data)
         .pipe(map((response) =>{
            return plainToInstance(UserEntity, response);}
        ),
      );
    }

    getUserAvatar(filename: string): Observable<Blob> {
        return  this.userService.getUserAvatar(filename);
    }
}


@Injectable({ providedIn: 'root', })
class UsersService {

    constructor(private readonly http: HttpClient) { }

    getAllUsers() {
        return this.http.get<any>(baseUrl + userUrl);
        //.subscribe(data => { console.log(data); });
    }

    updateUser(usrInstance: UserEntity) {
        let params = new HttpParams();
        params = params.set('id', usrInstance.userId);
        let instance = this.http.put<any>(baseUrl + userUrl + '/up/' + usrInstance.userId, usrInstance, ); //{ params: params });
        
        return instance;
    }

    addUser(usrInstance: UserEntity) {
        
      let regresa = this.http.post<any>(baseUrl + userUrl, instanceToPlain(usrInstance),);
      //console.log(regresa)
      return regresa;
    }

    uploadUserAvatar(data: any) {
      let ret =  this.http.post<any>(baseUrl+userUrl+'/upload', data) //.subscribe(resp => { console.log(JSON.stringify(resp)); });
      return ret;
    }

     getUserAvatar(filename: string): Observable<Blob> {
        return  this.http.get(baseUrl+userUrl+ '/images/' + filename, { responseType: 'blob' });
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
