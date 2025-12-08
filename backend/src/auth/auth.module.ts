import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { ServiceUser } from 'src/services/User.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityUser } from 'src/entities/User.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { RolModule } from 'src/modules/Rol.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EntityUser]),
    //PassportModule,
    JwtModule.register({
      //global: true,
      //secret: process.env.JWT_ACCESS_SECRET,
      //signOptions: { expiresIn: '180s' },
    }),
    RolModule
  ],
  providers: [AuthService,LocalStrategy,JwtStrategy,RefreshTokenStrategy,ServiceUser,TypeORMExceptions],
  controllers: [AuthController],
  exports: [AuthService,ServiceUser],
})
export class AuthModule {
  
}
