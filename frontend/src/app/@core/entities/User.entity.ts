
export class UserEntity {

  userId:string;

  email: string;

  login: Login;
  
  phone: string;
  
  picture: Picture;

  lastname: string;
  
  name: string;

  rol: Rol;
  
  get fullName(): string {
    return `${this.name} ${this.lastname}`;
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

class Rol {
  rolId: string;
  name: string;
}

class Picture {
  large: string;
  medium: string;
  thumbnail: string;
}
