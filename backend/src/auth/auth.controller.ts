import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto, CreateUserLoginDto } from 'src/dto/User.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { AuthGuard } from '@nestjs/passport';

//@Controller('auth')
@Controller({ version: '1', path: 'auth' })
export class AuthController {

    constructor(private authService: AuthService) {
    }

    //@UseGuards(LocalAuthGuard)
    /*@HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
        console.log('llega en el auth controller con ' + signInDto)
        return this.authService.signIn(signInDto.username, signInDto.password);
    }*/


    @Post('signup')
    signup(@Body() createUserDto: CreateUserLoginDto) {
        return this.authService.signUp(createUserDto);
    }

    @Post('login')
    async login(@Request() req) {
        return this.authService.signIn(req.body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('logout')
    logout(@Body() data: CreateUserLoginDto) {
        this.authService.logout(data);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    //@UseGuards(LocalAuthGuard)
    @UseGuards(RefreshTokenGuard)
    //@UseGuards(AuthGuard('local'))
    @Post('refresh')
    refreshTokens(@Request() req) {
        //const userId = req.user['sub'];
        //const refreshToken = req.user['refreshToken'];
        //console.log('el usuario ' + userId + ' y el refresh tokenazo: ' + refreshToken)

        return this.authService.refreshTokens(req.body);
    }


}
