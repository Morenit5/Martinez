import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMExceptions } from '../exceptions/TypeORMExceptions';
import { EntityRol } from '../entities/Rol.entity';
import { ControllerRoles } from 'src/controllers/Rol.controller';
import { ServiceRol } from 'src/services/Rol.service';

@Module({
  imports: [TypeOrmModule.forFeature([EntityRol])],
  providers: [ServiceRol, TypeORMExceptions],
  exports: [ServiceRol],
  controllers: [ControllerRoles],
})
export class RolModule {}