//import { Strategy } from 'passport-local';
//import { PassportStrategy } from '@nestjs/passport';
//import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';


@Injectable()
export class LocalStrategy extends  PassportStrategy( Strategy,'local') {

    constructor() {
      //console.log('la estrategia fue generada')
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_REFRESH_SECRET ||  jwtConstants.secret ,
        //passReqToCallback: true,
      });
    }

  async validate(req: Request, payload: any) {
    //console.log('llamamos al validate del jwt-refresh')
    let auth = req.get('Authorization');
    const refreshToken = auth?.replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}




/*PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(); //with passport-local, there are no configuration options, so our constructor simply calls super(), without an options object.
  }

  async validate(username: string, password: string): Promise<any> {
    console.log('aqui tamos en el validate')
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

  
    return user;
  }
}*/
