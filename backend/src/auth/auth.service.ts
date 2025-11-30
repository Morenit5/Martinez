import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserLoginDto, userDto } from 'src/dto/User.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { ServiceUser } from 'src/services/User.service';
import { log } from 'console';
import { RolDto } from 'src/dto/Rol.dto';

@Injectable()
export class AuthService {

  constructor(private usersService: ServiceUser, private jwtService: JwtService,private configService: ConfigService,) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /*async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };

  }*/

  //Funcion usada para crear un nuevo usuario y regresar  JWT token (access y refresh)
  async signUp(createUserDto: CreateUserLoginDto): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findOne(createUserDto.username);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);
   
    //create the new user
    const newUser = await this.usersService.createFullUser({...createUserDto,password:hash});
    
    //generate tokens (access and refresh) to return to user
    const tokens = await this.getTokens(newUser.userId, newUser.username);

    //update database with new refresh token 
    await this.updateRefreshToken(newUser.userId, tokens.refreshToken, createUserDto);

    return tokens; //return generated tokens 
  } 

  //Funcion usada para logear a un  usuario y regresar JWT token (access y refresh)
  async signIn(data: CreateUserLoginDto) {
    // Verify User account (whether it exists or not)
    //console.log(JSON.stringify(data))

    const user = await this.usersService.findOne(data.username);

    if (!user) throw new BadRequestException('User does not exist');

    //const passwordMatches = await argon2.verify(user.password, data.password);
    //console.log('1 ==>' + JSON.stringify(user))
    

    const hash = await this.hashData(user.password!); //tenemos que quitar esta linea ya que en realidad el passwor deberia estar hashed

    const passwordMatches = bcrypt.compareSync(data.password, hash);
    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    }
      
    //if login succeded generate a new access token and refresh token
    const tokens = await this.getTokens(user.userId, user.username);
    
    //update database with new refresh token 
    await this.updateRefreshToken(user.userId, tokens.refreshToken, data);
    
    let loginUser = {
    userId : user.userId,
    token : tokens.accessToken,
    refreshToken : tokens.refreshToken,
    expiresIn : 300,
    rolId : user.rol.rolId,
    name : user.rol.name,
    }

    return loginUser;
  }

  //Funcion usada para deslogear a un  usuario y regresar JWT token (access y refresh)
  async logout(usr: CreateUserLoginDto) {
    //aqui tenemos que seter el refresh token a null
    //userId, { refreshToken: null }
    //return this.usersService.update(usr);
    return this.usersService.update(usr.userId!,{...usr,userId:usr.userId,refreshToken:''});
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async getTokens(userId: number | undefined, username: string | undefined) {

    const payload = { sub: userId, username};

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload , {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '10m',
        },
      ),
      this.jwtService.signAsync(payload,{
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '60m', //'7d',
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
