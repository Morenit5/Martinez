import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControllerUser } from 'src/controllers/User.controller';
import { EntityUser } from 'src/entities/User.entity';
import { TypeORMExceptions } from 'src/exceptions/TypeORMExceptions';
import { ServiceUser } from 'src/services/User.service';

@Module({
  imports: [TypeOrmModule.forFeature([EntityUser])],
  providers: [ServiceUser, TypeORMExceptions],
  exports: [ServiceUser],
  controllers: [ControllerUser],
})
export class UserModule {}