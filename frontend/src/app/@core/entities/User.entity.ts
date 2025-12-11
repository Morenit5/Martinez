import { SafeUrl } from "@angular/platform-browser";

export class UserEntity {

  userId:string;

  email: string;

  login: Login;
  
  phone: string;
  
  picture: Picture;

  lastname: string;
  
  firstname: string;

  rol: RolEntity;

  username: string;

  password: string;

  avatar: string;
  
  enabled: boolean;
  
  imgBlob: SafeUrl;

  registryDate?: Date;
  
  get fullName(): string {
    return `${this.firstname} ${this.lastname}`;
  }
}


class Login {
  uuid: string;
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
}

export class RolEntity {
  rolId: number;
  name: string;
  enabled: boolean;
}

class Picture {
  large: string;
  medium: string;
  thumbnail: string;
}
