import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityPermission } from '../entities/Permission.entity';
import { TypeORMExceptions } from '../exceptions/TypeORMExceptions';
import { ControllerPermission } from '../controllers/Permission.controller';
import { ServicePermission } from '../services/Permission.service';



@Module({
  imports: [TypeOrmModule.forFeature([EntityPermission])],
  providers: [ServicePermission, TypeORMExceptions],
  exports: [ServicePermission],
  controllers: [ControllerPermission],
})
export class PermissionModule {}