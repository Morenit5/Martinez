import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Serializer } from 'src/interceptors/UserTransform.interceptor';
import { userDto } from './dto/User.dto';


@Serializer(userDto)
@Controller({ version: '1', path: 'ddd' })
export class AppController {
  constructor(private readonly appService: AppService,private authService: AuthService) {}

 
  @Post('/login')
  async login(@Request() req) {
    console.log('llega en el AppController')
    return this.authService.signIn(req.user);
  }


  @UseGuards(LocalAuthGuard)
  @Post('/logout')
  async logout(@Request() req) {
    return req.logout();
  }


  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
