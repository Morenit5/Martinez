import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserLoginDto, userDto } from 'src/dto/User.dto';
import * as bcrypt from 'bcrypt';
import { ServiceUser } from 'src/services/User.service';
import {  UpdateRolDto } from 'src/dto/Rol.dto';
import { ServiceRol } from 'src/services/Rol.service';

@Injectable()
export class AuthService {

  constructor(private usersService: ServiceUser, private jwtService: JwtService,private configService: ConfigService, private rolService: ServiceRol) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  //Funcion usada para crear un nuevo usuario y regresar  JWT token (access y refresh)
  async signUp(createUserDto: CreateUserLoginDto,isFirstUser: boolean = false): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findOne(createUserDto.username);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    //const hash = await this.hashData(createUserDto.password);
   
    //create the new user
    let newAdmin;
    if(isFirstUser && createUserDto.username == 'U0m4rCr3A73'){
      newAdmin = new CreateUserLoginDto();
      let userType = await this.rolService.findByRolName('admin');
      

      newAdmin.firstname = 'Omar',
      newAdmin.lastname = 'Martinez'
      newAdmin.email = 'omar@admin.com';
      newAdmin.username = 'omar@admin.com';
      newAdmin.avatar = 'placeholder.png';
      newAdmin.enabled = true;
      newAdmin.password = createUserDto.password;
      if(userType){
        newAdmin.rol  = new UpdateRolDto();
        newAdmin.rol.rolId = userType.rolId
      }
      //console.log(JSON.stringify(newAdmin));
    } else{
      newAdmin = createUserDto;
    }
    //const newUser = await this.usersService.createFullUser({...createUserDto,password:hash});
    const newUser = await this.usersService.createFullUser(newAdmin);
    
    //generate tokens (access and refresh) to return to user
    const tokens = await this.getTokens(newUser.userId, newUser.username);

    //update database with new refresh token 
    await this.updateRefreshToken(newUser.userId, tokens.refreshToken, createUserDto);


    const user = await this.usersService.findOne(newUser.username!);

    let loginUser = {
      userId: newUser.userId,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: 300,
      rolId: user!.rol.rolId,
      rolName: user!.rol.name,
      userName: newUser.firstname,
      fu:isFirstUser
    }

    return loginUser;
  } 

  //Funcion usada para logear a un  usuario y regresar JWT token (access y refresh)
  async signIn(data: CreateUserLoginDto) {

    const isEmpty = await this.usersService.isEmpty();
    if (isEmpty && isEmpty == true) {
      if (data.username == 'U0m4rCr3A73') {
        return await this.signUp(data, true);
      }
    }

    const user = await this.usersService.findOne(data.username);

    if (!user) throw new BadRequestException('User does not exist');

    //const hash = await this.hashData(user.password!); //tenemos que quitar esta linea ya que en realidad el passwor deberia estar hashed

    const passwordMatches = bcrypt.compareSync(data.password, user.password!);
    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    }

    //if login succeded generate a new access token and refresh token
    const tokens = await this.getTokens(user.userId, user.username);

    //update database with new refresh token 
    await this.updateRefreshToken(user.userId, tokens.refreshToken, data);

    let loginUser = {
      userId: user.userId,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: 300,
      rolId: user.rol.rolId,
      rolName: user.rol.name,
      userName: user.firstname
    }

    return loginUser;
  }

  //Funcion usada para deslogear a un  usuario y regresar JWT token (access y refresh)
  async logout(id:number, usr: CreateUserLoginDto) {
    //aqui tenemos que seter el refresh token a null

   
    let upUser = new CreateUserLoginDto();
    upUser.userId = id;
    upUser.refreshToken = '';

    return this.usersService.logoutUser(id , upUser);
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async getTokens(userId: number | undefined, username: string | undefined) {

    const payload = { sub: userId, username};

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload , {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(payload,{
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '120m', //'7d',
        },
      )
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userDto: CreateUserLoginDto) {
    
    const user = await this.usersService.findOneBy(userDto.userId!, userDto.username);
    
    if (!user || !user.refreshToken){
      throw new ForbiddenException('Access Denied');
    }
   
    const refreshTokenMatches = await bcrypt.compareSync(userDto.refreshToken ,user.refreshToken );
    
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.userId, user.username);
    await this.updateRefreshToken(user.userId, tokens.refreshToken,userDto);
    
    return tokens;
  }

  async updateRefreshToken(userId: number | undefined, refreshToken: string, usr: CreateUserLoginDto) {

    let hashedRefreshToken = await this.hashData(refreshToken);

    await this.usersService.update(userId!,{ refreshToken: hashedRefreshToken });
  }

}
