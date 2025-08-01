import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControllerUser } from '../controllers/User.controller';
import { EntityUser } from '../entities/User.entity';
import { TypeORMExceptions } from '../exceptions/TypeORMExceptions';
import { ServiceUser } from '../services/User.service';

@Module({
  imports: [TypeOrmModule.forFeature([EntityUser])],
  providers: [ServiceUser, TypeORMExceptions],
  exports: [ServiceUser],
  controllers: [ControllerUser],
})
export class UserModule {}